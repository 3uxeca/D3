/*
############################################################################
## 작성일 : 2019.09.02
## 작성자 : 정호승C
## 설 명  : 누적 막대그래프
############################################################################
*/

/*
=====================================================================
== 객체명 : XlbBarChart02
== 기 능  : 누적 막대그래프 
== 파라메터 : svgId    : String : ex> "xlbChart" 
== 예제     : var objChart = new XlbBarChart02("xlbChart");
=====================================================================
*/
var XlbBarChart02 = function(divId){

    //속성정의 
    this.tmpltCode  = "XBAC02"; //템플릿코드
    this.data       = []; //차트에 표시될 데이터 
    this.dataGroup  = ["그룹1", "그룹2"]; //차트 그룹 
    
    this.divId      = divId; //divId 
    this.svgId      = "SVG_" + divId;   //svg ID
    this.objDiv     = document.getElementById(divId); //svg Object
    this.width      = parseFloat(window.getComputedStyle(this.objDiv,null).getPropertyValue("width")); //넓이 
    this.height     = parseFloat(window.getComputedStyle(this.objDiv,null).getPropertyValue("height")); //높이
    this.font       = _XLB_CHART_FONT_FAMILY_[0]; //글꼴
    this.bLine      = true; 

    
    this.marginTop      = 20; 
    this.marginRight    = 30;
    this.marginBottom   = 60;
    this.marginLeft     = 60; 

    this.font = _XLB_CHART_FONT_FAMILY_[0]; // ["sans-serif","Impact"]
    this.fillColor  = _XLB_CHART_VAR_COLOR_;//그래프 색상; 

    //this.selectedColor = "#86E57F"; //선택된 막대그래프 색상 
    this.tooltipAble = true;  //툴팁표시여부 
    this.viewScroll  = true;  //스크롤표시여부

    /* 추가된 속성 */
    

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
    ** 파라메터: data : 표시될 데이터 : data.dataGroup : 그룹표시배열 
                                      data.data : 차트에 표시될 데이터 
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
        var rtnValue = {dataGroup: this.dataGroup, data:this.data}; 
        return rtnValue; 
    };

    /*********************************************************
    ** 함수명   : cvrtListToChartData
    ** 설 명    : 목록형태의 데이터를 컬럼설정을 기준으로 차트용 데이터로
    **          변환한다. 
    ** 파라메터 : dataSet : 원데이터 목록
    **         : colPropInfo : 컬럼 속성 :  param1 : x출 컬럼명 
    **                                     parma2 : key 가 될 컬럼명 
    **                                     param3 : value가 될 컬럼명
    ** 예제    : var listData  = [
    **                            {'saleMonth': '201901','itemCd':'IT001','itemNm': 'RAM','cnt': 89,'amount': 3000, 'area' : '서울'}
    **                           ,{'saleMonth': '201901','itemCd':'IT002','itemNm': 'CPU','cnt': 3,'amount': 100, 'area' : '서울'}
    **                           ,{'saleMonth': '201902','itemCd':'IT001','itemNm': 'RAM','cnt': 89,'amount': 3000, 'area' : '서울'}
    **                           ,{'saleMonth': '201902','itemCd':'IT002','itemNm': 'CPU','cnt': 30,'amount': 30000, 'area' : '서울'}
    **                           ]
    **         : var colPropInfo    = {param1:"saleMonth", param2:"itemNm", param3:"amount", userparam:["area"]};
    **         : var chartObj = createXlbChart("xlbChart","XBAC02");
    **         : var data = chartObj.cvrtListToChartdata(listData, colPropInfo);
    **         :    //data는 [{xlbchart_name:"2019010", xlbchart_value:"3000", pos:"강남영업1", manager:"에릭"}]
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

       // 3.객체에 담아 반환한다. 
       var data = []; 
       for(var i=0; i < dataKey.length; i++){
            var obj = new Object(); 
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
                .attr('id', this.svgId);
                // .attr('viewBox',[0,0, this.width, this.height]);
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
            var currentData = JSON.parse(d3.select(this).attr("data"));
            //fLog(fToString(currentData));
            //툴립표시 여부 
            if(vTooltipAble){
               
                //명칭이 있는 경우 
                if(currentData.xlbchart_key){

                    tooltip.select('.name').html('<b> Total : ' + currentData.xlbchart_total + '</b>');
                    tooltip.select('.val').html(currentData.xlbchart_key + " : " + d3.format(",")(currentData.xlbchart_value));

                    //var tooltipText = d.xlbchart_tooltip;
                    var tooltipText = ""; 

                    if(fTooltipFormat != null)
                        tooltipText = fTooltipFormat(currentData);

                    if(tooltipText != "")    
                        tooltip.select('.remark').html(tooltipText);

                    //tooltip.style('display', 'block');
                     tooltip.style('opacity', 2);

                }
            }

            //사용자 이벤트 호출 
            if(fMouseMove != null){
                fMouseMove(this, currentData);
            }
        })
        
        //mousemove
        .on('mousemove', function(d){
            var currentData = JSON.parse(d3.select(this).attr("data"));

            if(vTooltipAble){
                //명칭이 있는 경우 
                if(currentData.xlbchart_key){
                    tooltip
                .style('top', d3.event.layerY + 10 + 'px')
                .style('left', d3.event.layerX - 25 + 'px');
                }
            }

            //사용자 이벤트 호출 
            if(fMouseOver != null){
                fMouseOver(this, currentData);
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
        
        //onclick
        .on('click', function(d){
            var currentData = JSON.parse(d3.select(this).attr("data"));
            //d3.select('#' + svgId ).selectAll('rect').style("fill", this.fillColor);    
            //d3.select(this).style("fill", vSelectedColor);
            if(fOnClick != null){
                fOnClick(this, currentData);
            }
        })
        ;
        
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
        var layers = d3.stack()
            .keys(this.dataGroup)
            .offset(d3.stackOffsetDiverging)
            (data);

        if (this.viewScroll) {
            var xLength = d3.max(data, function(d) {return String(d.xlbchart_name).length;});
            var yLength = d3.max(data, function(d) {return String(d3.max(layers, stackMax)).length;});
    
            this.marginBottom   += (xLength*5);
            this.marginLeft     += (yLength*8);
            this.height         += (yLength*20);
            this.width          += (xLength*20);
        }

        var svg = d3.select('#' + this.svgId)
                    .attr('viewBox',[0,0, this.width, this.height])
                    .attr('font-size', 5)
                    .style("font-family", this.font);


        var x = d3.scaleBand()
        .rangeRound([this.marginLeft, this.width - this.marginRight])
        .padding(0.1);

        x.domain(data.map(function(d) {
            return d.xlbchart_name;
        }));

        var y = d3.scaleLinear()
        .rangeRound([this.height - this.marginBottom, this.marginTop]);

        y.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)]);

        function stackMin(layers) {
            return d3.min(layers, function(d) {
                return d[0];
            });
        }

        function stackMax(layers) {
            return d3.max(layers, function(d) {
                return d[1];
            });
        }

        var z = d3.scaleOrdinal(this.fillColor);

        var maing = svg.append("g")
        .selectAll("g")
        .data(layers);

        var g = maing.enter().append("g")
            .attr("fill", function(d) {
                return z(d.key);
            });

        var vDataGroup = this.dataGroup;    

        var rect = g.selectAll("rect")
            .data(function(d) {
                d.forEach(function(d1) {
                    d1.key = d.key;
                    return d1;
                });
                return d;
            })
            .enter().append("rect")
            .attr("data", function(d) {
                var data = {};
                data["xlbchart_key"] = d.key;
                data["xlbchart_value"] = d.data[d.key];
                var total = 0;
                vDataGroup.map(function(d1) {
                    //fLog(fToString(d.data));
                    //fLog(d1);

                    if(!fIsNull(d.data[d1])){
                        total = total + d.data[d1];
                    }
                });
                data["xlbchart_total"] = total;

                fCopyData(data, d.data);
                return JSON.stringify(data);
            })
            .attr("width", x.bandwidth)
            .attr("x", function(d) {
                return x(d.data.xlbchart_name);
            })
            .attr("y", function(d) {
                return y(d[1]);
            })
            .attr("height", function(d) {
                return y(d[0]) - y(d[1]);
            });

            if(this.bLine){
                svg.append("g")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(d3.axisBottom(x))
                .append("text")
                .attr("x", this.width / 2)
                .attr("y", this.marginBottom * 0.5)
                .attr("dx", "0.32em")
                .attr("fill", "#000")
                ;

                svg.selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .attr("text-anchor", "end");

                svg.append("g")
                .attr("transform", "translate(" + this.marginLeft + ",0)")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", 0 - (this.height / 2))
                .attr("y", 15 - (this.marginLeft))
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr('font-family', this.font)
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle");
            }
        svg.selectAll(".tick").selectAll("text").attr('font-family', this.font);
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
    ** 필수여부 : 필수 
    ** 함수명 : exChart 
    ** 설 명  : 차트를 그린다.
    **********************************************************/
    this.exChart = function(){
        /*
        ##########################################
        ## 1.SVG를 초기화 한다. 
        ## 2.차트구분을 표기한다. 
        ## 3.차트를 그린다. 
        ## 4.툴팁을 표시한다. 
        ##########################################
        */
       var exData = this.data; //실제 실행될 데이터 

       // 1.SVG를 초기화 한다. 
       this.clearChart();
       this.createChart();

       // 2.차트 구분을 표기한다. 
       this.createChartLegend(); 

       // 3.차트를 그린다. 
       this.drawScale(exData); 

       // 4.툴팁을 표시한다. 
       if(this.tooltipAble)
            this.createTooltip();

       // 5.이벤트를 호출한다.
       this.createEvent();     
    };

};