/*
############################################################################
## 작성일 : 2019.09.26
## 작성자 : 정두선B
## 설 명  : 그룹바 차트
##          param1 : name으로 쓰임 
##          param2 : value로 쓰임 
##          param3 : tooltip으로 쓰임 
############################################################################
*/

var XlbGroupBarChart01 = function(divId) {

    //속성정의
    this.tmpltCode      = "XGBC01"; //템플릿코드
    this.data           = []; //차트에 표시될 데이터 
    this.divId          = divId; //divId 
    this.svgId          = "SVG_" + divId; //svg ID
    this.objDiv         = document.getElementById(divId); //svg Object
    this.width          = parseFloat(window.getComputedStyle(this.objDiv,null).getPropertyValue("width")); //넓이 
    this.height         = parseFloat(window.getComputedStyle(this.objDiv,null).getPropertyValue("height")); //높이
    this.sortAble       = false; //정렬여부
    this.tooltipAble    = false; //툴팁여부
    this.viewScroll     = true;  //스크롤표시여부
    this.margin         = { top: 20, right: 10, bottom: 30, left: 40 };
    this.font           = _XLB_CHART_FONT_FAMILY_[0]; //글꼴
    this.fillColor      = _XLB_CHART_VAR_COLOR_;//그래프 색상; 

    this.marginTop      = 50; 
    this.marginRight    = 0;
    this.marginBottom   = 50;
    this.marginLeft     = 40; 


    //동적함수 
    this.tooltipFormat = null; //툴립 반환 포맷

    //이벤트 정의 
    this.mouseover = null;  //마우스 over
    this.mousemove = null;  //마우스 move
    this.mouseout  = null;  //마우스 out
    this.onclick   = null;  //마우스 onclick

    this.x = null;
    this.y = null;

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
    ** 함수명 : getTmpltCode
    ** 설 명  : 정의된 템플릿 코드를 반환한다. 
    **********************************************************/
    this.getTmpltCode = function(){
        return this.tmpltCode;
    };

    /*********************************************************
    ** 함수명 : getdivId
    ** 설 명  : 차트에 할당된 divId를 반환한다 '#'없음 
    **********************************************************/
    this.getDivId = function(){
        return this.divId; 
    };

    /*********************************************************
    ** 함수명 : getSvgId
    ** 설 명  : 차트에 할당된 svgId를 반환한다 '#'없음 
    **********************************************************/
    this.getSvgId = function(){
        return this.svgId; 
    };

    /*********************************************************
    ** 함수명 : setSortAble
    ** 설 명  : 정렬여부 설정
    ** 파라메터 : sortAble : boolean : [true:정렬 | false:정렬안함] 
    **********************************************************/
    this.setSortAble = function(sortAble){
        this.sortAble = sortAble; 
    };

    /*********************************************************
    ** 함수명 : getTooltipAble
    ** 설 명  : 툴팁여부반환
    **********************************************************/
    this.getTooltipAble = function(){
        return this.tooltipAble;
    };

    /*********************************************************
    ** 함수명 : setTooltipAble
    ** 설 명  : 정렬여부 설정
    ** 파라메터 : tooltipAble : boolean : [true:툴팁표시 | false:툴팁미표시] 
    **********************************************************/
    this.setTooltipAble = function(tooltipAble){
        this.tooltipAble = tooltipAble; 
    };

    /*********************************************************
    ** 함수명 : setData
    ** 설 명  : 데이터를 설정한다. 
    ** 파라메터: data : 표시될 데이터 : name : 명칭, value : 값 
    **********************************************************/
    this.setData = function(data){
        this.dataGroup = data.dataGroup; 
        this.data = data.data; 
    };

    /*********************************************************
    ** 함수명 : getData
    ** 설 명  : 데이터를 반환한다. 
    **********************************************************/
    this.getData = function(){
        return this.data; 
    };

    /*********************************************************
    ** 함수명 : setTooltipFormat
    ** 설 명  : 툴팁표시시 해당 포맷으로 처리 
    **********************************************************/
   this.setTooltipFormat = function(tooltipFormat){
        this.tooltipFormat = tooltipFormat;
   };

    /*********************************************************
    ** 함수명   : cvrtListToChartData
    ** 설 명    : 목록형태의 데이터를 컬럼설정을 기준으로 차트용 데이터로
    **          변환한다. 
    ** 파라메터 : listData : 원데이터 목록
    **         : colPropInfo : 컬럼 속성 :  param1 : xlbchart_name 
    **                                     parma2 : xlbchart_value 
    **                                     param3 : xlbchart_value
    ** 예제    : var listData       = [{sepalLength: 5.1,sepalWidth: 3.5,petalLength: 1.4,petalWidth: 0.2,species: 'setosa'}];
    **         : var colPropInfo    = {param1:"species", param2:"sepalLength", param3:"petalLength",param4:"sepalWidth",param5:"petalWidth"};;
    **         : var chartObj = createXlbChart("xlbChart","XSCC01");
    **         : var data = chartObj.cvrtListToChartdata(listData, colPropInfo);
    **         :    //data는 [{xlbchart_name: 'setosa', xlbchart_xvalue: 5.1, xlbchart_yvalue: 0.2 }]
    **         : chartObj.setData(data);
    **********************************************************/

    this.cvrtListToChartData = function(dataSet, colPropInfo){

        var rtnData = {};
        var dataList = dataSet.data; 

        /*
        ##############################
        ## 1.LEGEND를 생성한다.
        ## 2.xlbchart_name별로  데이터 객체를 LEGEND기준으로 생성한다. 
        ## 3.객체에 담아 반환한다. 
        ##############################
        */
       // 1.LEGEND를 생성한다.
       var legend = fDistinctValue(dataList, colPropInfo.param2);

       // 2.xlbchart_name별로  데이터 객체를 LEGEND기준으로 생성한다. 
       var dataKey = fDistinctValue(dataList, colPropInfo.param1);

       var data = dataSet.data; 
    
       // 3.객체에 담아 반환한다. 
       var data = [];
       var viewData = [];  
       for(var i=0; i < dataKey.length; i++){
            var obj = new Object(); 
            //obj.State = dataKey[i];
            obj.xlbchart_name = dataKey[i];
            for(var j=0; j < dataList.length; j++){
                var row = dataList[j]; 
                if(dataKey[i] == row[colPropInfo.param1]){
                    var total = 0; 
                    var colName = row[colPropInfo.param2];
                    var value   = row[colPropInfo.param3];
                    if(!fIsNone(obj[colName])){
                        total = obj[colName];
                    }

                    if(!fIsNull(value)){
                        total += value; 
                    }

                    obj[colName] = total; 
                    //obj.xlbchart_value = total;
                }
                
                if(!fIsNull(colPropInfo.userparam)){
                    var arrUserParam     = colPropInfo.userparam;
                    for(var k=0; k < arrUserParam.length; k++){
                        obj[arrUserParam[k]] = row[arrUserParam[k]];
                    }
                }
            }
            data.push(obj);
       }

       rtnData.dataGroup = legend;
       rtnData.data = data; 

        return rtnData; 
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
    ** 함수명 : createChart
    ** 설 명  : svg를 생성한다. 
    **********************************************************/
    this.createChart = function(){
        d3.select('#' + this.divId)
                  .append("svg")
                  .attr('id', this.svgId);
                //   .attr('viewBox',[0,0, this.width, this.height]);
    };

    /*********************************************************
    ** 함수명 : drawScale
    ** 설 명  : 차트를 그린다.
    **********************************************************/
   this.drawScale = function(data) {
    if (this.viewScroll) {
        var xLength = d3.max(data, function(d) {return String(d.key).length;});
        var yLength = d3.max(data, function(d) {return String(d.value).length;});
    
        this.margin.bottom  += (xLength*5);
        //this.margin.left    += (yLength*8);
        this.margin.right   += (xLength*5);
        this.height         += (xLength*20);
        this.width          += (yLength*20);
    }

    var svg = d3.select('#' + this.svgId)
                .attr('viewBox',[0,0, this.width, this.height]);

    var columns = [];
    columns = this.dataGroup;
    columns.unshift("xlbchart_name");

    var keys = columns.slice(1);
    var groupKey = columns[0];

    var vHeight         = this.height;
    var vWidth          = this.width;
    var vMargin_bottom  = this.margin.bottom;
    var vMargin_left    = this.margin.left;

    /*
    var color = d3.scaleOrdinal()
                  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    */
    var color = d3.scaleOrdinal()
                  .range(this.fillColor);
    
    var x0 = d3.scaleBand()
               .domain(data.map(function(d) {return  d[groupKey]; } )) 
               .rangeRound([this.margin.left, this.width - this.margin.right])
               .paddingInner(0.1);

    var x1 = d3.scaleBand()
               .domain(keys)
               .rangeRound([0, x0.bandwidth()])
               .paddingInner(0.1);

   var  y = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) {return d3.max(keys, function(key) { return d[key]; } ); } )]).nice()
              .rangeRound([this.height - this.margin.bottom, this.margin.top])
              ;
    


    function legend(svg) {
        
        var g = svg
               .attr("transform", 'translate('+vWidth+',0)')
               .attr("text-anchor", "end")
               .attr("font-family", "sans-serif")
               .attr("font-size", 10)
               .selectAll("g")
               .data(color.domain().slice().reverse())
               .enter()
               .append("g")
               .attr("transform", function(d, i) { return 'translate(0,'+ i * 20+ ')'; } );

               g.append("rect")
                .attr("x", -30)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color);

              g.append("text")
               .attr("x", -40)
               .attr("y", 9.5)
               .attr("dy", "0.35em")
               .text(function(d) { return d; });

                return g;

    }
    
    
    function xAxis(g) {
        return g.attr('transform', 'translate(0,' + (vHeight - vMargin_bottom) + ')')
                .call(d3.axisBottom(x0));

    }
    
    function yAxis(g) {
        return g.attr('transform', function(d) {
                                                   return 'translate(' + vMargin_left + ',0)';
                                               }
                     )
                .call(d3.axisLeft(y).ticks(null, "s"))
                .call(function(g) {return g.select('.domain').remove();})
                .call(function(g) {return g.select(".tick:last-of-type text").clone()
                                           .attr("x", 7)
                                           .attr("text-anchor", "start")
                                           .attr("font-weight", "bold");
                                  }
                     );
    }

        svg.append("g")
           .selectAll("g")
           //.data(data)
           //.enter()

           .data(data)
           .enter()
           .append('g')
           .attr("transform", function(d) { return 'translate('+ x0(d[groupKey]) +', 0)' ; })
           
           .selectAll("rect")
           .data(function(d) { return keys.map( function(key) {return ({key:key, value: d[key]}); }) ; } )

           .enter()
           .append("rect")
           .attr("x"     , function(d) { 
                                       return x1(d.key); 
                                   } )
           
           .attr("y"     , function(d) { return y(d.value); })
           .attr("width" ,  x1.bandwidth() )
           .attr("height", function(d) { return y(0) - y(d.value); })
           .attr("fill"  , function(d) {return color(d.key); } )
           
           svg.append('g').call(xAxis);
           svg.append('g').call(yAxis);
           //svg.append("g").call(legend);
   };


   /*********************************************************
    ** 함수명 : createChartLegend
    ** 설 명  : 그룹을 차트에 표기한다. 
    **********************************************************/
    this.createChartLegend = function(){
        var z = d3.scaleOrdinal(this.fillColor);
        var tag = ""; 
        var keys = this.dataGroup;
        var font = this.font;

        keys.forEach(function(d) {
            var cloloCode = z(d);
            tag += "<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
                        <span style='background:" + cloloCode +
                    ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;'>&nbsp;</span>\
                        <span style='padding-top: 0;font-family:"+font+";font-size: 13px;display: inline;'>" + d +
                    " </span>\
                    </span>";
        });

        $("#" + this.svgId).before("<div id='Legend_" + this.svgId + "' class='pmd-card-body' style='margin-top:0; margin-bottom:0;'>" + tag + "</div>");

    };

   /*********************************************************
    ** 함수명 : createEvent
    ** 설 명  : 이벤트를 생성한다. 
    **********************************************************/
    this.createEvent = function(){
        var svgRect = d3.select('#' + this.svgId ).selectAll('rect');        
        var tooltip = d3.select('#' + this.svgId + "_tooltip");
        var vTooltipAble = this.tooltipAble;
        var vSelectedColor = this.selectedColor;
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
                if( d.key){

                	tooltip.select('.name').html('<b>' + d.key + '</b>');
                    tooltip.select('.val').html(d3.format(",")( d.value ));

                    //var tooltipText = d.xlbchart_tooltip;
                    /*
                    var tooltipText = ""; 

                    if(fTooltipFormat != null)
                        tooltipText = fTooltipFormat(currentData);

                    if(tooltipText != "")    
                        tooltip.select('.remark').html(tooltipText);
                    */
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
                if(d.key){
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
                    .style('left', 0 + 'px');

            //사용자 이벤트 호출 
            if(fMouseOut != null){
                fMouseOut();
            }
        })
        ;
   };
   

    /*********************************************************
    ** 함수명 : createTooltip 
    ** 설 명  : 툴팁을 생성하여 설정한다. 
    **********************************************************/
    this.createTooltip = function(){
        
            var svg = d3.select('#' + this.divId );
            var tooltip = d3.select('#' + this.divId)
                            .append('div')
                            .attr('id', this.svgId + '_tooltip')
                            .attr('class', 'tooltip');

            tooltip.append('div').attr('class', 'name');
            tooltip.append('div').attr('class', 'val'); 
            tooltip.append('div').attr('class', 'remark'); 
            
    };


    /*********************************************************
    ** 필수여부 : 필수 
    ** 함수명 : exChartValidation
    ** 설 명  : 정상적인 차트인지 확인한다. 
    **********************************************************/
   this.exChartValidation = function(){
    var rtnValue = ""; 

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
        ## 2.차트를 그린다.
        ## 3.툴팁을 표시한다.
        ## 4.이벤트를 호출한다.
        ##########################################
        */
        var exData = this.data; //실제 실행될 데이터 

        // 1.SVG를 초기화 한다. 
        this.clearChart();
        this.createChart();

        // 2.데이터를 검증하고 이상이 있으면 exception을 던진다 
        var errMsg = this.exChartValidation();
        if(!fIsNull(errMsg)) throw errMsg;

        // 3.차트 legend을 표기한다. 
        this.createChartLegend(); 

        // 4.차트를 그린다. 
        this.drawScale(exData); 

        // 5.툴팁을 표시한다. 
        if(this.tooltipAble)
                this.createTooltip();

        // 6.이벤트를 호출한다.
        this.createEvent();
    };
};