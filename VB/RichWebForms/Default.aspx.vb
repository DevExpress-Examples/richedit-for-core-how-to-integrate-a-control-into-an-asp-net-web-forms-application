Imports System
Imports System.Collections
Imports System.Collections.Generic
Imports System.IO
Imports System.Linq
Imports System.Web
Imports System.Web.Script.Services
Imports System.Web.Services
Imports System.Web.UI
Imports System.Web.UI.WebControls

Namespace RichWebForms
    Partial Public Class [Default]
        Inherits System.Web.UI.Page

        Public InitialDocument As String
        Private Const documentFolderPath = "~/App_Data/"
        Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
            InitialDocument = Convert.ToBase64String(System.IO.File.ReadAllBytes(
                                                     Server.MapPath($"{documentFolderPath}template.docx")))
        End Sub

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
                Case 3
                    Return "rtf"
                Case 1
                    Return "txt"
            End Select
            Return "docx"
        End Function
    End Class
End Namespace