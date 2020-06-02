<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="RichWebForms.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.common.css" />
    <link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.light.compact.css" />
    <link rel="stylesheet" type="text/css" href="node_modules/devexpress-richedit/dist/dx.richedit.css" />

    <script src="Scripts/jquery-3.5.1.min.js"></script>
    <script src="node_modules/devexpress-richedit/dist/custom/dx.richedit.js"></script>
    <script src="Scripts/creator.js"></script>
    <script>
        $(document).ready(function () {
            const rich = createRichEdit($("#rich-container"), {
                exportUrl: 'Default.aspx/Export',
                document: '<%=InitialDocument %>',
            });
            window.rich = rich;
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="scm" runat="server" EnablePageMethods="true" />
        <div>
            <button onclick="setDataSource(window.rich, 'Default.aspx/GetDataSource'); return false;">setDataSource</button>
            <button onclick="appendMergeFields(window.rich); return false;">addMergeFields</button>
            <button onclick="mailMerge(window.rich); return false;">mailMerge</button>
            <div id='rich-container' style="width: 100%; height: 900px"></div>
        </div>
    </form>
</body>
</html>
