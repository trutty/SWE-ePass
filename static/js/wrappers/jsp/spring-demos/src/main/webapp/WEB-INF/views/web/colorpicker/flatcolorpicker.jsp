<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>
<demo:header />

<div class="demo-section">
    <div id="bike">
        <div id="bike-tail" class="inline-block"></div><div id="bike-head" class="inline-block"></div>
    </div>

    <div class="picker-wrapper inline-block">
        <h3 class="title">Tail color</h3>
       	<kendo:flatColorPicker name="tail" class="picker" value="#000" change="select" preview="false">
       	</kendo:flatColorPicker>
    </div>
    <div class="picker-wrapper inline-block">
        <h3 class="title">Front &amp; side color</h3>
       	<kendo:flatColorPicker name="head" class="picker" value="#e15613" change="select" preview="false">
       	</kendo:flatColorPicker>
    </div>
</div>

<script>
    function select(e) {
        $("#bike-" + this.element.attr("id")).css("background-color", e.value);
    }
</script>

<style scoped>
    .demo-section {
        text-align: center;
        width: 580px;
        padding-bottom: 16px;
    }

    .title {
        font-weight: normal;
        text-transform: uppercase;
        color: #666;
    }

    #bike {
        margin: -10px -10px 0;
        background: url(../../resources/colorpicker/background.png);
    }

    #bike-head, #bike-tail {
        background: url(../../resources/web/colorpicker/motor.png);
        height: 299px;
        width: 241px;
    }

    #bike-tail {
        background-color: #000;
    }

    #bike-head {
        background-color: #e15613;
        background-position: -241px 0;
    }

    .picker-wrapper {
        text-align: left;
        width: 252px;
        margin: 0 18px;
    }

    .picker-wrapper .k-hsv-gradient {
        height: 140px;
    }

    .picker-wrapper h3 {
        padding: 13px 0 5px;
        text-align: left;
    }

    .inline-block {
        display: inline-block;
    }

    .k-ie7 .inline-block {
        display: inline;
        zoom: 1;
    }
</style>

<demo:footer />