<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>
<demo:header />

<div class="demo-section">
    <div id="background">
        <div class="column">
            <h3 class="title">Select Wall Paint</h3>
            <kendo:colorPalette name="palette" columns="4"
            	palette="#f0d0c9,#e2a293,#d4735e,#65281a,#eddfda,#dcc0b6,#cba092,#7b4b3a,#fcecd5,#f9d9ab,#f6c781,#c87d0e,#e1dca5,#d0c974,#a29a36,#514d1b,#c6d9f0,#8db3e2,#548dd4,#17365d"
            	change="preview">
            	<kendo:colorPalette-tileSize width="34" height="19" />
            </kendo:colorPalette>
        </div>

        <div class="column">
            <h3 class="title">Choose Custom Color</h3>
            <kendo:colorPicker name="picker" value="#ffffff" select="preview">
            </kendo:colorPicker>
        </div>
    </div>
</div>

<script>
    function preview(e) {
        $("#background").css("background-color", e.value);
    }
</script>

<style scoped>
    .demo-section {
        width: 600px;
        height: 600px;
    }

    #background {
        background-image: url(../../resources/web/colorpicker/interior-bg.png);
        background-color: transparent;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .column {
        margin-top: 384px;
        float: left;
        width: 300px;
        text-align: center;
    }

    .column .title {
        color: #a3a3a3;
        text-transform: uppercase;
        font-size: 11px;
        font-weight: normal;
        padding: 41px 0 20px;
    }

    #palette {
        vertical-align: top;
        display: inline-block;
    }

    .k-colorpicker {
        vertical-align: top;
        margin: 20px 0;
    }
</style>

<demo:footer />