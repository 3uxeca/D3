/*
############################################################################
## 작성일 : 2019.09.11
## 작성자 : 한준구D
## 설 명  : 기본 막대그래프 (가로형)
##          param1 : name으로 쓰임 
##          param2 : value로 쓰임 
##          param3 : tooltip으로 쓰임 
############################################################################
*/

/*
=====================================================================
== 객체명 : XlbBarChart03
== 기 능  : 기본 막대그래프 (가로형)
== 파라메터 : divId    : String : ex> "xlbChart" 
== 예제     : var objChart = new XlbBarChart03("xlbChart");
=====================================================================
*/
var XlbBarChart03 = function(divId){

    //속성정의 
    this.tmpltCode  = "XBAC03"; //템플릿코드
    this.data       = []; //차트에 표시될 데이터 
    this.divId      = divId; //divId 
    this.svgId      = "SVG_" + divId;   //svg ID
    this.objDiv     = document.getElementById(divId); //svg Object
    this.width      = parseFloat(window.getComputedStyle(this.objDiv,null).getPropertyValue("width")); //넓이 
    this.height     = parseFloat(window.getComputedStyle(this.objDiv,null).getPropertyValue("height")); //높이
    this.font       = _XLB_CHART_FONT_FAMILY_[0]; //글꼴
    this.sortAble   = false; //정렬여부
    this.tooltipAble = true;  //툴팁표시여부 
    this.viewScroll = true;  //스크롤표시여부
    
    this.marginTop      = 20; 
    this.marginRight    = 0;
    this.marginBottom   = 30;
    this.marginLeft     = 40; 

    this.fillColor  = d3.scaleOrdinal(_XLB_CHART_VAR_COLOR_);//막대그래프 색상
    this.selectedColor = "#86E57F"; //선택된 막대그래프 색상 
    

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
    ** 함수명 : getProperty
    ** 설 명  : 프로퍼티를 반환한다.  
    ** 파라메터 : propertyName : String : 프로퍼티명
    ** ex > objChart.getProperty("fillColor");
    ** 반환값 : varriant : 속성 값 속성이 없는 경우 null
    **********************************************************/
    this.getProperty = function(propertyName){
        return fGetProperty(this, propertyName);
    };

    /*********************************************************
    ** 함수명 : getSvgId
    ** 설 명  : 차트에 할당된 svgId를 반환한다 '#'없음 
    **********************************************************/
    this.getSvgId = function(){
        return this.svgId; 
    };

    /*********************************************************
    ** 함수명 : getWidth
    ** 설 명  : width 반환 
    **********************************************************/
    this.getWidth = function(){
        return this.width;
    };

    /*********************************************************
    ** 함수명 : setWidth
    ** 설 명  : width 설정
    ** 파라메터 : width : number : 넓이 설정 
    **********************************************************/
    this.setWidth = function(width){
        this.width = width;
    };

   /*********************************************************
    ** 함수명 : getHeight
    ** 설 명  : width 반환 
    **********************************************************/
    this.getHeight = function(){
        return this.height;
    };

    /*********************************************************
    ** 함수명 : setHeight
    ** 설 명  : height 설정
    ** 파라메터 : height : number : 넓이 설정 
    **********************************************************/
    this.setHeight = function(height){
        this.height = height;
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
    ** 함수명 : getSortAble
    ** 설 명  : 정렬여부반환
    **********************************************************/
    this.getSortAble = function(){
        return this.sortAble;
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
    ** 함수명 : getFillColor
    ** 설 명  : 막대그래프 컬러를 반환한다. 
    **********************************************************/
    this.getFillColor = function(){
        return this.fillColor; 
    };

    /*********************************************************
    ** 함수명 : setFillColor
    ** 설 명  : 색상을 설정한다. 
    ** 파라메터: data : 표시될 데이터 : name : 명칭, value : 값 
    **********************************************************/
    this.setFillColor = function(fillColor){
        this.fillColor = fillColor; 
    };

    /*********************************************************
    ** 함수명 : setToolTipAble
    ** 설 명  : 툴팁적용여부를 설정한다. 
    ** 파라메터: toolTipAble : boolean : true : 표시
                                        false : 표시안함
    **********************************************************/
    this.setToolTipAble = function(toolTipAble){
        this.tooltipAble = toolTipAble;
    };

    /*********************************************************
    ** 함수명 : getToolTipAble
    ** 설 명  : 툴팁여부를 반환한다. 
    **********************************************************/
   this.getToolTipAble = function(){
        return this.tooltipAble;
   };

    /*********************************************************
    ** 함수명 : setSelectedColor
    ** 설 명  : 선택된 상태의 색상을 설정한다. 
    ** 파라메터: toolTipAble : boolean : true : 표시
                                        false : 표시안함
    **********************************************************/
   this.setSelectedColor = function(selectedColor){
        this.selectedColor = selectedColor;
   };  

   /*********************************************************
    ** 함수명 : getSelectedColor
    ** 설 명  : 선택된 상태의 색상을 반환한다. 
    **********************************************************/
   this.getSelectedColor = function(){
        return this.selectedColor;
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
    ** 파라메터 : dataSet : 원데이터 목록
    **         : colPropInfo : 컬럼 속성 :  param1 : xlbchart_name 
    **                                     parma2 : xlbchart_value 
    **                                     param3 : tooltip
    ** 예제    : var listData       = [{workday: "20190101", totamt:3000, avgatm:1000, remark:"2019-01-01 매출", pos:"강남영업1", manager:"에릭"}];
    **         : var colPropInfo    = {param1:"workday", param2:"totamt", param3:"remark", userparam:["pos", "manager"]};
    **         : var chartObj = createXlbChart("xlbChart","XBC01");
    **         : var data = chartObj.cvrtListToChartdata(listData, colPropInfo);
    **         :    //data는 [{xlbchart_name:"2019010", xlbchart_value:"3000", pos:"강남영업1", manager:"에릭"}]
    **         : chartObj.setData(data);
    **********************************************************/
    this.cvrtListToChartData = function(dataSet, colPropInfo){
        var rtnData = new Array(); 
        var listData = dataSet.data; 
        for(var i=0; i < listData.length; i++){
            var row = listData[i];
            var obj = new Object(); 
            obj.xlbchart_name    = row[colPropInfo.param1];
            obj.xlbchart_value   = row[colPropInfo.param2];
            obj.xlbchart_tooltip = row[colPropInfo.param3];

            if(!fIsNone(colPropInfo["userparam"])){
                var arrUserParam     = colPropInfo.userparam;
                for(var j=0; j < arrUserParam.length; j++){
                    obj[arrUserParam[j]] = row[arrUserParam[j]];
                }
            }
            rtnData.push(obj);
        }

        return rtnData; 
    };

    /*********************************************************
    ** 함수명 : sortData
    ** 설 명  : 데이터를 sort 처리 한다. 
    **********************************************************/
    this.sortData = function(data){
        return data.sort(function(a, b) {
            return b.xlbchart_value - a.xlbchart_value;
        });
    };

    /*********************************************************
    ** 함수명 : createChart
    ** 설 명  : SVG를 생성한다. 
    **********************************************************/
    this.createChart = function(){
        d3.select('#' + this.divId)
                  .append("svg")
                  .attr('id', this.svgId);
                //   .attr('viewBox',[0,0, this.width, this.height]);
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
        d3.select('#' + svgId ).selectAll('rect').style("fill", this.fillColor);
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
                    .style('left', 0 + 'px');

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
        if (this.viewScroll) {
            var yLength = d3.max(data, function(d) {return String(d.xlbchart_name).length;});
    
            this.marginLeft += (yLength*5);
            this.width      += (yLength*20);
        }

        var svg = d3.select('#' + this.svgId)
                    .attr('viewBox',[0,0, this.width, this.height]);

        var x = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(data, function(d) {
                return d.xlbchart_value;
            })
        ]) //데이터
        .nice()
        .range([this.marginLeft, this.width - this.marginRight - this.marginLeft]);
        
        var y = d3
        .scaleBand()
        .domain(
            data.map(function(d) {
                return d.xlbchart_name;
            })
        )
        .range([this.marginTop, this.height - this.marginBottom - this.marginTop])
        .padding(0.1);
        
        var vHeight         = this.height; 
        var vMargin_bottom  = this.marginBottom; 
        var vMargin_top     = this.marginTop; 
        var vMargin_left    = this.marginLeft;
        function xAxis(g) {
            return g
                .attr(
                    'transform',
                    'translate(0,' + (vHeight - vMargin_bottom - vMargin_top) + ')'
                )
                .call(d3.axisBottom(x).tickSizeOuter(0));
        }
    
        function yAxis(g) {
            return g
                .attr('transform', 'translate(' + vMargin_left + ',0)')
                .call(d3.axisLeft(y))
                .call(function(g) {
                    return g.select('.domain').remove();
                });
        }

        var vFillColor = this.fillColor;
        var vSelectedColor = this.selectedColor;

        svg.append('g')
        .selectAll('rect') //차트 타입
        .data(data) //데이터
        .enter()
        .append('rect') //차트 타입
        // .attr('x', function(d) {
        //     return x(d.xlbchart_value);
        // })
        .attr('fill', function(d){return vFillColor(d.xlbchart_name);}) // 막대 색상
        .attr('x', vMargin_left)
        // .transition()    //애니메이션 생략
        // .duration(1000)
        // .delay(function(d,i){
        //     return i * 100;
        // })
        .attr('y', function(d) {
            return y(d.xlbchart_name);
        })
        .attr('width', function(d) {
            return x(d.xlbchart_value);
        })
        .attr('height', y.bandwidth())        
        ;

        svg.append('g').call(xAxis);
        svg.append('g').call(yAxis);
        svg.selectAll(".tick").selectAll("text").attr('font-family', this.font);
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
       this.createChart();

       // 2.데이터를 SORT 처리한다. 
       if(this.sortAble){
         exData = this.sortData(this.data);
       }

       // 3.차트를 그린다. 
       this.drawScale(exData); 

       // 4.툴팁을 표시한다. 
       if(this.tooltipAble)
            this.createTooltip();

       // 5.이벤트를 호출한다.
       this.createEvent();     
    };

};