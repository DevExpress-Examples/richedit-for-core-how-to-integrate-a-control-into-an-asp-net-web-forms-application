using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace RichWebForms
{
    public partial class Default : System.Web.UI.Page
    {
        public string InitialDocument;
        private const string documentFolderPath = "~/App_Data/";
        protected void Page_Load(object sender, EventArgs e)
        {
            InitialDocument = Convert.ToBase64String(System.IO.File.ReadAllBytes(
                Server.MapPath($"{documentFolderPath}template.docx")));
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true)]
        public static IEnumerable<Hashtable> GetDataSource()
        {
            int id = 0;
            return new[] { "John", "Piter", "Mark" }.Select(name => new Hashtable() { { "FirstName", name }, { "Id", id++ } }).ToList();
        }

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
                case 3: return "rtf";
                case 1: return "txt";
            }
            return "docx";
        }
    }
}