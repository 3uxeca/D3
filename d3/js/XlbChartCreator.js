/*
############################################################################
## 작성일   : 2019.08.29
## 작성자   : 정호승C
## 설 명    : 템플릿 코드에 해당하는 차트를 Object 형태로 반환한다. 
## 코드정의 : XBC01 : XlbBarChart01 : 바차트 기본    
############################################################################
*/

/*
=====================================================================
== 함수명 : createXlbChart
== 기 능  : 파라메터로 넘어온 tmpltCode를 기준으로 차트 객체를 생성하여 반환
== 파라메터 : divId    : String : ex> "xlbChart" 
==           tmplCode : String : ex> "XBAC01" 
==           chartTypeForTmap : String : 티맵에 표시될 차트 템플릿 코드 
== 예제     : var objChart = createXlbChart("xlbChart","XBAC01");
=====================================================================
*/
function createXlbChart(divId, tmpltCode){

    var obj = null; 
    switch (tmpltCode) {
        case 'XBAC01':
            obj = new XlbBarChart01(divId);
            break;
        case 'XBAC02':
            obj = new XlbBarChart02(divId);
            break;
        case 'XBAC03':
            obj = new XlbBarChart03(divId);
            break;
        case 'XBAC04':
            obj = new XlbBarChart04(divId);
            break;
        case 'XBUC01':
            obj = new XlbBubbleChart01(divId);
            break;
        case 'XBUC02':
            obj = new XlbBubbleChart02(divId);
            break;
        case 'XDOC01':
            obj = new XlbDonutChart01(divId);
            break;
        case 'XDPC01':
            obj = new XlbDotPlotChart01(divId);
            break;
        case 'XDPC02':
            obj = new XlbDotPlotChart02(divId);
            break;
        case 'XDPC03':
            obj = new XlbDotPlotChart03(divId);
            break;
        case 'XLIC01':
            obj = new XlbLineChart01(divId);
            break;
        case 'XLIC02':
            obj = new XlbLineChart02(divId);
            break;
        case 'XLIC03':
            obj = new XlbLineChart03(divId);
            break;
        case 'XLIC04':
            obj = new XlbLineChart04(divId);
            break;
        case 'XARC01':
            obj = new XlbAreaChart01(divId);
            break;
        case 'XARC02':
            obj = new XlbAreaChart02(divId);
            break;
        case 'XALC01':
            obj = new XlbAreaLineChart01(divId);
            break;
        case 'XPIC01':
            obj = new XlbPieChart01(divId);
            break;
        case 'XSCC01':
            obj = new XlbScatterChart01(divId);
            break;
        case 'XRAC01':
            obj = new XlbRadarChart01(divId);
            break;

        case 'XTMC01':
            obj = new XlbTmapChart01(divId);
            break;    
        case 'XTRC01':
            obj = new XlbTreemapChart01(divId);
            break;
        case 'XSBC01':
            obj = new XlbSunburstChart01(divId);
            break;
        // case 'XSBC02':
        //     obj = new XlbSunburstChart02(divId);
        //     break;
         case 'XWCC01':
            obj = new XlbWordCloudChart01(divId);
            break;
            
        case 'XHMC01':
            obj = new XlbHeatMapChart01(divId);
            break;

        case 'XFCC01':
            obj = new XlbForceChart01(divId);
            break;    
        case 'XGBC01':
            obj = new XlbGroupBarChart01(divId);
            break;       
    }

    return obj; 
}