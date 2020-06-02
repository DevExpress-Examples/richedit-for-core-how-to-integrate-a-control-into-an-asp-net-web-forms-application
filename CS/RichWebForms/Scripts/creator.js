/// <reference path="../node_modules/devexpress-richedit/dist/dx.richedit.d.ts" />

function createRichEdit(richEditContainer, initialOptions) {
    /** @type {DevExpress.RichEdit.Options} */
    var options = DevExpress.RichEdit.createOptions();
    customizeRibbon(options);
    //options.exportUrl = initialOptions.exportUrl; //cannot be used with WebMethods
    options.events.saving = (s, e) => {
        e.handled = true;
        $.ajax({
            url: initialOptions.exportUrl,
            type: 'POST',
            data: JSON.stringify({ base64: e.base64, fileName: e.fileName, format: e.format, reason: e.reason }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                alert('An error occurred... Please open the Console tab (press F12 or Ctrl+Shift+I) for more information!');

                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('errorThrown:');
                console.log(errorThrown);
            },
        });
    }
    options.confirmOnLosingChanges.enabled = false;

    var elem = document.createElement('div');
    richEditContainer.append(elem);

    /** @type {DevExpress.RichEdit.RichEdit} */
    var rich = DevExpress.RichEdit.create(elem, options);
    rich.openDocument(initialOptions.document, 'fileName', DevExpress.RichEdit.DocumentFormat.OpenXml, function () {
        rich.document.insertText(rich.document.length, 'Some text');
    });
    return rich;
}

/**
 * @param {DevExpress.RichEdit.Options} options
 */
function customizeRibbon(options) {
    options.ribbon.removeTab(DevExpress.RichEdit.RibbonTabType.MailMerge);
    options.ribbon.removeTab(DevExpress.RichEdit.RibbonTabType.References);
    options.ribbon.getTab(DevExpress.RichEdit.RibbonTabType.File)
        .removeItem(DevExpress.RichEdit.FileTabItemId.OpenDocument);
    options.ribbon.getTab(DevExpress.RichEdit.RibbonTabType.View)
        .removeItem(DevExpress.RichEdit.ViewTabItemId.ToggleShowHorizontalRuler);
}

/**
 * @param {DevExpress.RichEdit.RichEdit} rich
 * @param {string} url
 */
function setDataSource(rich, url) {
    rich.loadingPanel.show();
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8"
    }).done(function (response) {
        rich.mailMergeOptions.setDataSource(response.d, function () {
            rich.loadingPanel.hide();
        });
    });
}

/**
 * @param {DevExpress.RichEdit.RichEdit} rich
  */
function mailMerge(rich) {
    if (!rich.mailMergeOptions.getDataSource()) {
        alert('No data source');
        return;
    }

    rich.loadingPanel.show();
    rich.mailMerge(function (documentAsBlob) {
        blobToBase64(documentAsBlob, function (documentAsBase64) {
            rich.openDocument(documentAsBase64, 'MergedDocument', DevExpress.RichEdit.DocumentFormat.OpenXml, function () {
                rich.loadingPanel.hide();
            });
        });
    }, DevExpress.RichEdit.MergeMode.NewParagraph, DevExpress.RichEdit.DocumentFormat.OpenXml);
}

function blobToBase64(blob, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        var base64data = reader.result;
        callback(base64data);
    }
}
/**
 * @param {DevExpress.RichEdit.RichEdit} rich
  */
function appendMergeFields(rich) {
    var position = rich.selection.active;
    var sd = rich.selection.activeSubDocument;

    function insertField(name) {
        var field = sd.fields.createMergeField(position, name);
        field.update();
        position = field.interval.end;
    }

    rich.beginUpdate();
    rich.history.beginTransaction();
    position = sd.insertParagraph(position).interval.end;
    position = sd.insertText(position, 'FirstName: ').end;
    insertField('FirstName');
    position = sd.insertText(position, ', Id: ').end;
    insertField('Id');
    position = sd.insertParagraph(position).interval.end;
    rich.history.endTransaction();
    rich.endUpdate();
    rich.focus();
}

