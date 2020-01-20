/*
############################################################################
## 작성일 : 2019.09.02
## 작성자 : 정호승C
## 설 명  : 누적 막대그래프 
############################################################################
*/

/*
=====================================================================
== 객체명 : XlbChartTemplet
== 기 능  : 누적 막대그래프 
== 파라메터 : divId    : String : ex> "xlbChart" 
== 예제     : var objChart = new XlbChartTemplet("xlbChart");
=====================================================================
*/
var XlbChartTemplet = function(divId){

    //속성정의 
    this.tmpltCode  = "XBAC02"; //템플릿코드
    this.data       = []; //차트에 표시될 데이터 
    this.divId      = divId; //divId 
    this.svgId      = "SVG_" + divId;   //svg ID
    this.objDiv     = document.getElementById(divId); //svg Object
    this.width      = parseFloat(window.getComputedStyle(this.objDiv,null).getPropertyValue("width")); //넓이 
    this.height     = parseFloat(window.getComputedStyle(this.objDiv,null).getPropertyValue("height")); //높이
    this.font           = _XLB_CHART_FONT_FAMILY_[0]; //글꼴
    
    this.marginTop      = 20; 
    this.marginRight    = 0;
    this.marginBottom   = 30;
    this.marginLeft     = 40; 

    //this.fillColor  = '#BCFFB5';//막대그래프 색상
    //this.selectedColor = "#86E57F"; //선택된 막대그래프 색상 
    this.tooltipAble = true;  //툴팁표시여부 

    //동적함수 
    this.tooltipFormat = null; //툴립 반환 포펫 

    //이벤트 정의 
    this.mouseover = null;  //마우스 OVER 
    this.mousemove = null;  //마우스 move
    this.mouseout  = null;  //마우스 out
    this.onclick   = null;  //마우스 onclick

    /*********************************************************
    ** 함수명 : getTmpltCode
    ** 설 명  : 정의된 템플릿 코드를 반환한다. 
    **********************************************************/
    this.getTmpltCode = function(){
        return this.tmpltCode;
    };

    /*********************************************************
    ** 함수명 : setProperties
    ** 설 명  : 프로퍼티를 일괄로 설정한다. 
    ** 파라메터 : objProperties : Object : 프로퍼티 객체 
    ** ex > var objProperties = {fillColor:"yellow", selectedColor:"red"}; 
    **      objChart.setProperties(objProperties);
    **********************************************************/
    this.setProperties = function(objProperties){
        return fCopyProperties(this, objProperties);
    };

    /*********************************************************
    ** 함수명 : setProperty
    ** 설 명  : 프로퍼티를 설정한다. 
    ** 파라메터 : propertyName : String : 프로퍼티명
    **           property : varriant : 프로퍼티 값 
    ** ex > objChart.setProperty("fillColor", "yellow");
    **********************************************************/
    this.setProperty = function(propertyName, property){
        fSetProperty(this, propertyName, property);
    };

    /*********************************************************
    ** 함수명 : setData
    ** 설 명  : 데이터를 설정한다. 
    ** 파라메터: data : 표시될 데이터 : name : 명칭, value : 값 
    **********************************************************/
    this.setData = function(data){
        this.data = data; 
    };

    /*********************************************************
    ** 함수명 : getData
    ** 설 명  : 데이터를 반환한다. 
    **********************************************************/
    this.getData = function(){
        return this.data; 
    };

    /*********************************************************
    ** 함수명   : cvrtListToChartData
    ** 설 명    : 목록형태의 데이터를 컬럼설정을 기준으로 차트용 데이터로
    **          변환한다. 
    ** 파라메터 : dataSet : 원데이터 목록
    **         : colPropInfo : 컬럼 속성 :  param1 : xlbchart_name 
    **                                     parma2 : xlbchart_value 
    **                                     param3 : tooltip
    ** 예제    : var dataSet.data       = [{workday: "20190101", totamt:3000, avgatm:1000, remark:"2019-01-01 매출", pos:"강남영업1", manager:"에릭"}];
    **         : var colPropInfo    = {param1:"workday", param2:"totamt", param3:"remark", userparam:["pos", "manager"]};
    **         : var chartObj = createXlbChart("xlbChart","XBC01");
    **         : var data = chartObj.cvrtListToChartdata(listData, colPropInfo);
    **         :    //data는 [{xlbchart_name:"2019010", xlbchart_value:"3000", pos:"강남영업1", manager:"에릭"}]
    **         : chartObj.setData(data);
    **********************************************************/
    this.cvrtListToChartData = function(dataSet, colPropInfo){
        var listData = dataSet.data; 
        var rtnData = new Array();
        /* 
        for(var i=0; i < listData.length; i++){
            var row = listData[i];
            var obj = new Object(); 
            obj.xlbchart_name    = row[colPropInfo.param1];
            obj.xlbchart_value   = row[colPropInfo.param2];
            obj.xlbchart_tooltip = row[colPropInfo.param3];
            var arrUserParam     = colPropInfo.userparam;
            for(var j=0; j < arrUserParam.length; j++){
                obj[arrUserParam[j]] = row[arrUserParam[j]];
            }
            rtnData.push(obj);
        }
        */
        return rtnData; 
    };


    /*********************************************************
    ** 함수명 : createChart
    ** 설 명  : SVG를 생성한다. 
    **********************************************************/
    this.createChart = function(){
        d3.select('#' + this.divId)
                .append("svg")
                .attr('id', this.svgId)
                .attr('viewBox',[0,0, this.width, this.height]);
    };

    /*********************************************************
    ** 함수명 : clearChart 
    ** 설 명  : 차트를 초기화 한다. 
    **********************************************************/
    this.clearChart = function(){
        fClearChart(this.divId);
        d3.selectAll('#'+this.svgId + '_tooltip').remove();
    };

    /*********************************************************
    ** 함수명 : clearSelect
    ** 설 명  : 선택을 초기화 한다. 
    **********************************************************/
    this.clearSelect = function(){
        //d3.select('#' + svgId ).selectAll('rect').style("fill", this.fillColor);
    };

    /*********************************************************
    ** 함수명 : createEvent
    ** 설 명  : 이벤트를 생성한다. 
    **********************************************************/
   this.createEvent = function(){
       /*
        var svgRect = d3.select('#' + this.svgId ).selectAll('rect');        
        var tooltip = d3.select('#' + this.svgId + "_tooltip");
        var vTooltipAble = this.tooltipAble;
        //var vSelectedColor = this.selectedColor;
        var fMouseOver = null; 
        var fMouseMove = null; 
        var fMouseOut  = null; 
        var fOnClick   = null; 
        var fTooltipFormat = null; 
        
        if(this.mouseover != null)
            fMouseOver = this.mouseover;
        
        if(this.mousemove != null)
            fMouseMove = this.mousemove;
        
        if(this.mouseout != null)
            fMouseOut = this.mouseout; 

        if(this.onclick != null)
            fOnClick = this.onclick; 

        if(this.tooltipFormat != null)
            fTooltipFormat = this.tooltipFormat; 
            
        //mouseover
        svgRect.on('mouseover', function(d){
            //툴립표시 여부 
            if(vTooltipAble){
                //명칭이 있는 경우 
                if(d.xlbchart_name){
                    tooltip.select('.name').html('<b>' + d.xlbchart_name + '</b>');
                    tooltip.select('.val').html(d3.format(",")(d.xlbchart_value));

                    var tooltipText = d.xlbchart_tooltip;

                    if(fTooltipFormat != null)
                        tooltipText = fTooltipFormat(d);

                    tooltip.select('.remark').html(tooltipText);

                    //tooltip.style('display', 'block');
                     tooltip.style('opacity', 2);
                }
            }

            //사용자 이벤트 호출 
            if(fMouseMove != null){
                fMouseMove(this, d);
            }
        })
        
        //mousemove
        .on('mousemove', function(d){
            if(vTooltipAble){
                //명칭이 있는 경우 
                if(d.xlbchart_name){
                    tooltip
                .style('top', d3.event.layerY + 10 + 'px')
                .style('left', d3.event.layerX - 25 + 'px');
                }
            }

            //사용자 이벤트 호출 
            if(fMouseOver != null){
                fMouseOver(this, d);
            }
        })
        
        //mouseout
        .on('mouseout', function(){
            tooltip.style('opacity', 0)
                    .style('top', '100%')
                    .style('left', '0px');

            //사용자 이벤트 호출 
            if(fMouseOut != null){
                fMouseOut();
            }
        })
        
        //onclick
        .on('click', function(d){
            d3.select('#' + svgId ).selectAll('rect').style("fill", this.fillColor);    
            d3.select(this).style("fill", vSelectedColor);
            if(fOnClick != null){
                fOnClick(this, d);
            }
        })
        ;
        */
   };

    /*********************************************************
    ** 함수명 : createTooltip 
    ** 설 명  : 툴팁을 생성하여 설정한다. 
    **********************************************************/
   this.createTooltip = function(){
        var tooltip = d3.select('#' + this.divId)
                        .append('div')
                        .attr('id', this.svgId + '_tooltip')
                        .attr('class', 'tooltip');

        tooltip.append('div').attr('class', 'name');
        tooltip.append('div').attr('class', 'val'); 
        tooltip.append('div').attr('class', 'remark'); 
   };

    /*********************************************************
    ** 함수명 : drawScale
    ** 설 명  : 차트를 그린다.
    **********************************************************/
    this.drawScale = function(data){
        
    };

    /*********************************************************
    ** 필수여부 : 필수 
    ** 함수명 : exChartValidation
    ** 설 명  : 정상적인 차트인지 확인한다. 
    **********************************************************/
    this.exChartValidation = function(){

        var rtnValue = ""; 
        /*
        for(var i=0; i < this.data.length; i++){
            var row = this.data[i];
            var value = row.xlbchart_value; 
            if(fIsNull(value)){
                value = 0; 
            }

            if(isNaN(value)) {
                rtnValue = _XLB_ERR_MSG_VALID_TYPE_; 
                break; 
            }
        }
        */
        return rtnValue; 
    };

    /*********************************************************
    ** 필수여부 : 필수 
    ** 함수명 : exChart 
    ** 설 명  : 차트를 그린다.
    **********************************************************/
    this.exChart = function(){
        /*
        ##########################################
        ## 1.SVG를 초기화 한다. 
        ## 2.데이터를 SORT 처리한다. 
        ## 3.차트를 그린다. 
        ## 4.툴팁을 표시한다. 
        ##########################################
        */
       var exData = this.data; //실제 실행될 데이터 

       // 1.SVG를 초기화 한다. 
       this.clearChart();

       //데이터를 검증하고 이상이 있으면 exception을 던진다 
       var errMsg = this.exChartValidation();
       if(!fIsNull(errMsg)) throw errMsg;

       this.createChart();

       // 2.데이터를 SORT 처리한다. 
       //if(this.sortAble){
       //  exData = this.sortData(this.data);
       //}

       // 3.차트를 그린다. 
       this.drawScale(exData); 

       // 4.툴팁을 표시한다. 
       if(this.tooltipAble)
            this.createTooltip();

       // 5.이벤트를 호출한다.
       this.createEvent();     
    };

};