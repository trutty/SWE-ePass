<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<demo:header />
    <div class="configuration k-widget k-header" style="width:170px;">
        <span class="configHead">Configuration</span>
        <span class="configTitle">Pie Chart</span>
        <ul class="options">
            <li>
                <input id="labels" checked="checked" type="checkbox" autocomplete="off" />
                <label for="labels">Show labels</label>
            </li>
            <li>
                <input id="alignCircle" name="alignType" type="radio"
                        value="circle" checked="checked" autocomplete="off" />
                <label for="alignCircle">- aligned in circle</label>
            </li>
            <li>
                <input id="alignColumn" name="alignType" type="radio"
                        value="column" autocomplete="off" />
                <label for="alignColumn">- aligned in columns</label>
            </li>
        </ul>
    </div>

    <kendo:chart name="chart">
        <kendo:chart-title text="What is you favourite sport?" />
        <kendo:chart-legend position="top" />
        <kendo:chart-series>
           <kendo:chart-seriesItem type="pie" data="${pieData}">
               <kendo:chart-seriesItem-labels visible="true" template="#= category # - #= kendo.format('{0:P}', percentage)#" />
           </kendo:chart-seriesItem>
        </kendo:chart-series>
        <kendo:chart-tooltip visible="true" template="#= category # - #= kendo.format('{0:P}', percentage)#" />
    </kendo:chart>
    
	<script>
	    $(document).ready(function() {
	        $(".configuration").bind("change", refresh);
	    });
	
	    function refresh() {
	        var chart = $("#chart").data("kendoChart"),
	            pieSeries = chart.options.series[0],
	            labels = $("#labels").prop("checked"),
	            alignInputs = $("input[name='alignType']"),
	            alignLabels = alignInputs.filter(":checked").val();
	
	        chart.options.transitions = false;
	        pieSeries.labels.visible = labels;
	        pieSeries.labels.align = alignLabels;
	
	        alignInputs.attr("disabled", !labels);
	
	        chart.refresh();
	    }
	</script>
         
    <style>
	    .k-chart {
	        height: 280px;
	        padding: 37px;
	        margin: 0 0 50px 0;
	        width: 390px;
	    }
	</style>
<demo:footer />
