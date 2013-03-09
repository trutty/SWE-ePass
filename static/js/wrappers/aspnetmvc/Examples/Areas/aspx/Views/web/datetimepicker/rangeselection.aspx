<%@ Page Title="" Language="C#" MasterPageFile="~/Areas/aspx/Views/Shared/Web.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
<div class="demo-section" style="width: 535px;">
    <label for="start">Start date:</label>

    <%= Html.Kendo().DateTimePicker()
          .Name("start")
          .Value(DateTime.Today)
          .Max(DateTime.Today)
          .ParseFormats(new string[] { "MM/dd/yyyy" })
          .Events(e => e.Change("startChange"))
    %>

    <label for="end" style="margin-left:3em">End date:</label>
    <%= Html.Kendo().DateTimePicker()
          .Name("end")
          .Value(DateTime.Today)
          .Min(DateTime.Today)
          .ParseFormats(new string[] { "MM/dd/yyyy" })
          .Events(e => e.Change("endChange"))
    %>
</div>
<script>
    function startChange() {
        var endPicker = $("#end").data("kendoDateTimePicker"),
            startDate = this.value();

        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate() + 1);
            endPicker.min(startDate);
        }
    }

    function endChange() {
        var startPicker = $("#start").data("kendoDateTimePicker"),
            endDate = this.value();

        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate() - 1);
            startPicker.max(endDate);
        }
    }
</script>

</asp:Content>