<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>

<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:url value="/web/treeview/remote-data/read" var="transportReadUrl" />

<demo:header />

 <kendo:treeView name="treeview" class="demo-section" dataTextField="fullName">
     <kendo:dataSource>
         <kendo:dataSource-transport>
             <kendo:dataSource-transport-read url="${transportReadUrl}" type="POST"  contentType="application/json"/>    
             <kendo:dataSource-transport-parameterMap>
             	<script>
              	function parameterMap(options,type) {
              		return JSON.stringify(options);
              	}
             	</script>
             </kendo:dataSource-transport-parameterMap>         
         </kendo:dataSource-transport>
         <kendo:dataSource-schema>
             <kendo:dataSource-schema-hierarchical-model id="employeeId" hasChildren="hasEmployees" />
         </kendo:dataSource-schema>
     </kendo:dataSource>
 </kendo:treeView>

    <style scoped>
    
        #example {
            text-align: center;
        }
        
        .demo-section {
            display: inline-block;
            vertical-align: top;
            width: 320px;
            height: 300px;
            text-align: left;
            margin: 0 2em;
        }

    </style>
<demo:footer />
