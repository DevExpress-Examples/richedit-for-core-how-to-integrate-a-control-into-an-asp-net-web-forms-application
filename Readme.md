# RichEdit for ASP.NET Core - How to integrate a control into an ASP.NET Web Forms application

## Requirements
* To use the RichEdit control in an ASP.NET Web Forms application, you need to have a [Universal, DXperience, or ASP.NET subscription](https://www.devexpress.com/buy/net/).
* Versions of the devexpress npm packages should be identical (their major and minor versions should be the same).

This example illustrates a possible way of integrating a client part of ASP.NET Core Rich Edit into an ASP.NET Web Forms application. This can be done as follows:
1. Right-click the application name in the **Solution Explorer** and select **Add | Add New Item**. In the invoked **Add New Item** dialog, select the **Installed | Visual C# | ASP.NET Core | Web** category and the **npm Configuration File** item template. Click **Add**.
This adds the **package.json** file to the project. Open this file and add the following dependencies:
```json
{
  "version": "1.0.0",
  "name": "asp.net",
  "private": true,
  "dependencies": {
    "devextreme": "20.1.3",
    "devexpress-richedit": "20.1.3"
  }
}
```

2. Create a RichEdit bundle using recommendations from this help topic: [Create a RichEdit Bundle](https://docs.devexpress.com/AspNetCore/401721/office-inspired-controls/get-started/richedit-bundle#create-a-richedit-bundle) 
3. Install the jQuery library and register it along with the RichEdit bundle on a page:

```html
...
<link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.common.css" />
<link rel="stylesheet" type="text/css" href="node_modules/devextreme/dist/css/dx.light.compact.css" />
<link rel="stylesheet" type="text/css" href="node_modules/devexpress-richedit/dist/dx.richedit.css" />

<script src="Scripts/jquery-3.5.1.min.js"></script>
<script src="node_modules/devexpress-richedit/dist/custom/dx.richedit.js"></script>
<script src="Scripts/creator.js"></script>
...
```

4. Add a container to a page on which RichEdit will be created:

```aspx
<form id="form1" runat="server">
...
	<div id='rich-container' style="width: 100%; height: 900px"></div>
...
</form>
```

5. Create a server method with the **[WebMethod](https://docs.microsoft.com/en-us/aspnet/web-forms/overview/older-versions-getting-started/aspnet-ajax/understanding-asp-net-ajax-web-services)** attribute in code behind for the document export:

```cs
private const string documentFolderPath = "~/App_Data/";
...
[WebMethod]
public static void Export(string base64, string fileName, int format, string reason)
{
	byte[] fileContent = Convert.FromBase64String(base64);
	string path = System.Web.Hosting.HostingEnvironment.MapPath($"{documentFolderPath}{fileName}.{GetExtension(format)}");
	System.IO.File.WriteAllBytes(path, fileContent);
}

private static string GetExtension(int format)
{
	switch (format)
	{
		case 4: return "docx";
		case 2: return "rtf";
		case 1: return "txt";
	}
	return "docx";
}
```

```vb
Private Const documentFolderPath = "~/App_Data/"
...
<WebMethod>
Public Shared Sub Export(ByVal base64 As String, ByVal fileName As String, ByVal format As Integer, ByVal reason As String)
	Dim fileContent() As Byte = Convert.FromBase64String(base64)
	Dim path As String = Hosting.HostingEnvironment.MapPath($"{documentFolderPath}{fileName}.{GetExtension(format)}")
	File.WriteAllBytes(path, fileContent)
End Sub

Private Shared Function GetExtension(ByVal format As Integer) As String
	Select Case format
		Case 4
			Return "docx"
		Case 2
			Return "rtf"
		Case 1
			Return "txt"
	End Select
	Return "docx"
End Function
```

Take special note that you also need to drop [ScriptManager](https://docs.microsoft.com/en-us/dotnet/api/system.web.ui.scriptmanager?view=netframework-4.8) into the form and enable its EnablePageMethods option.

6. If you wish to open a document on RichEdit's first load, save the document path to a public global variable to pass it to RichEdit's page:

```cs
public string InitialDocument;
...
protected void Page_Load(object sender, EventArgs e)
{
	InitialDocument = Convert.ToBase64String(System.IO.File.ReadAllBytes(
		Server.MapPath($"{documentFolderPath}template.docx")));
}
```  

```vb
Public InitialDocument As String
...
Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
	InitialDocument = Convert.ToBase64String(System.IO.File.ReadAllBytes(
		Server.MapPath($"{documentFolderPath}template.docx")))
End Sub
```

7. Use the static **DevExpress.RichEdit.createOptions** and **DevExpress.RichEdit.create** methods to create control options and the control itself respectively. To simplify this process, we created the "creator.js" file located at the "~/Scripts" folder.
It is sufficient to call the **createRichEdit** method located in this file:

```html
<script>
    $(document).ready(function () {
		const rich = createRichEdit($("#rich-container"), {
			exportUrl: 'Default.aspx/Export',
			document: '<%=InitialDocument %>',
		});
		window.rich = rich;
	});
</script>
```

8. To execute mail merge, use the following RichEdit API:

* The [MailMergeOptions.setDataSource](https://docs.devexpress.com/AspNetCore/js-DevExpress.RichEdit.MailMergeOptions#js_devexpress_richedit_mailmergeoptions_setdatasource_datasource_) method to specify a data source;
* The [FieldCollection.createMergeField](https://docs.devexpress.com/AspNetCore/js-DevExpress.RichEdit.FieldCollection?p=netframework#js_devexpress_richedit_fieldcollection_createmergefield_position_name_) method to create a new merge field;
* The [RichEdit.mailMerge](https://docs.devexpress.com/AspNetCore/js-DevExpress.RichEdit.RichEdit?p=netframework#js_devexpress_richedit_richedit_mailmerge_callback_) method to execute mail merge.

In this example, we use the following buttons on a page and call the **setDataSource**, **appendMergeFields**, and **mailMerge** methods from the "creator.js" file:

```html
<button onclick="setDataSource(window.rich, 'Default.aspx/GetDataSource'); return false;">setDataSource</button>
<button onclick="appendMergeFields(window.rich); return false;">addMergeFields</button>
<button onclick="mailMerge(window.rich); return false;">mailMerge</button>
```

To load data from the server side, create a method with the **WebMethod** and **ScriptMethod** attributes:

```cs
[WebMethod]
[ScriptMethod(UseHttpGet = true)]
public static IEnumerable<Hashtable> GetDataSource()
{
	int id = 0;
	return new[] { "John", "Piter", "Mark" }.Select(name => new Hashtable() { { "FirstName", name }, { "Id", id++ } }).ToList();
}
```

```vb
<WebMethod, ScriptMethod(UseHttpGet:=True)>
Public Shared Function GetDataSource() As IEnumerable(Of Hashtable)
	Dim personId As Integer = 0
	Dim data = {"John", "Piter", "Mark"}.Select(Function(name) New Hashtable() From {
		{"FirstName", name},
		{"Id", personId}
	}).ToList()
	personId += 1
	Return data
End Function
```

<!-- default file list -->
*Files to look at*:

* [Default.aspx](./CS/RichWebForms/Default.aspx) (VB:[Default.aspx](./VB/RichWebForms/Default.aspx))
* [Default.aspx.cs](./CS/RichWebForms/Default.aspx.cs) (VB:[Default.aspx.vb](./VB/RichWebForms/Default.aspx.vb))
* [creator.js](./CS/RichWebForms/Scripts/creator.js)
<!-- default file list end -->
