# RichEdit for ASP.NET Core - How to integrate a control into an ASP.NET Web Forms application

## Requirements
* To use the RichEdit control in an ASP.NET Web Forms application, you need to have a [Universal, DXperience, or ASP.NET subscription](https://www.devexpress.com/buy/net/).
* Versions of the devexpress npm packages should be identical (their major and minor versions should be the same).

This example illustrates a possible way of integrating a client part of ASP.NET Core Rich Edit into an ASP.NET Web Forms application using steps from the following help topic: [Rich Text Editor > Get Started > Web Forms Application](https://docs.devexpress.com/AspNetCore/401876/rich-edit/get-started/web-forms-application).

> **NOTE** 
The client-side RichEdit libraries are added via NPM. It is necessary to restore the NPM packages before starting the project.
Use the "Restore packages" command for the package.json file from Visual Studio ([Add npm support to a project](https://docs.microsoft.com/en-us/visualstudio/javascript/npm-package-management?view=vs-2019#npmAdd)) or run [npm install](https://docs.npmjs.com/cli/install).  

***See also:***  
[RichEdit for ASP.NET Core - How to integrate a control into an MVC application](https://github.com/DevExpress-Examples/richedit-for-core-how-to-integrate-a-control-into-an-mvc-application)

<!-- default file list -->
*Files to look at*:

* [Default.aspx](./CS/RichWebForms/Default.aspx) (VB:[Default.aspx](./VB/RichWebForms/Default.aspx))
* [Default.aspx.cs](./CS/RichWebForms/Default.aspx.cs) (VB:[Default.aspx.vb](./VB/RichWebForms/Default.aspx.vb))
* [creator.js](./CS/RichWebForms/Scripts/creator.js)
<!-- default file list end -->
