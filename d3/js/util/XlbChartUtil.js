/*
############################################################################
## 작성일 : 2019.08.29
## 작성자 : 정호승C
## 설 명  : 차트 Util 클래스 
############################################################################
*/

/*********************************************************
** 함수명 : fLog
** 설 명  : 콘솔에 로그를 출력한다. 
** 파라메터 : log : String : 로그 
**********************************************************/
function fLog(log, bHeader){
	
	if(bHeader == null) bHeader = true; 
	
	if(bHeader)
		console.log("XlbChart Log >> " + log);
	else 
		console.log(log);
}

/*********************************************************
** 함수명 : fLogParam
** 설 명  : 파라메터를 출력한다.  
** 파라메터 : param : String : 파라메터 
**********************************************************/
function fLogParam(param){
	fLog("=====================================================");
	fLog("== 파라메터 START ");
	fLog("=====================================================");
	
	fLog(fGetObjLog(param),false); 
	
	fLog("=====================================================");
	fLog("== 파라메터 END ");
	fLog("=====================================================");
}

function fGetObjLog(obj){
	var rtnValue = ""; 
	if(typeof obj == "object"){
		if(Array.isArray(obj)){
			rtnValue += "["; 
			var tmpVal = ""; 
			for(var i=0; i < obj.length; i++){
				
				if(tmpVal != "") tmpVal += ", ";
				
				tmpVal += fGetObjLog(obj[i]); 
			}
			rtnValue += tmpVal + "]"; 
		} else {
			//var rtnValue = "";
			
			rtnValue += "{";
			var tmpVal = ""; 
			for(key in obj){
				
				if(tmpVal != "") tmpVal += ", "; 
				
				tmpVal += " " + key + " : " + fGetObjLog(obj[key]) + "" ;
	        }
			rtnValue += tmpVal + "} ";
		}
		
	} else {
		rtnValue += "'" + obj + "'";  
	}
	
	return rtnValue; 
} 

/*********************************************************
** 함수명 : fLogList
** 설 명  : 콘솔에 로그를 출력한다. 
** 파라메터 : log : String : 로그 
**********************************************************/
function fLogList(list){
    for(var i=0; i < list.length; i++){
        fLog(fToString(list[i]));
    }
}

/*********************************************************
** 함수명 : fToString
** 설 명  : Object를 String으로 변한한다. 
** 파라메터 : obj : Object :변환할 객체 
**           bArray : boolean : true : array 
**                              false : not array
**********************************************************/
function fToString(obj, bArray){
    var rtnValue = ""; 
    if(bArray == null) bArray = false; 

    if(bArray){
        rtnValue += "LENGTH :: " + obj.length + "\n";
        for(var i=0; i < obj.length; i++){
            rtnValue += "rowIndex ::" + i + ">> " + fToString(obj[i]) + "\n";
        }
    }

    if(typeof obj == "object"){
        for(var key in obj){
            rtnValue += " < " + key + " : " + obj[key] + " >";
        }
    }

    if(typeof obj == "string"){
        rtnValue += " < string : " + obj + " >";
    }

    if(typeof obj == "number"){
        rtnValue += " < number : " + obj + " >";
    }
    return rtnValue;
}

/*********************************************************
** 함수명 : clearSvg 
** 설 명  : div를 초기화 한다. 
** 파라메터 : divId : DIV 아이디 
**********************************************************/
function fClearChart(divId){
	
	if(fIsNone(document.getElementById(divId))) return; 
	
    d3.select('#' + divId ).selectAll('*').remove();    
    var className = document.getElementById(divId).className;
    if(fIsNone(className)) return;
    className = className.replace("tmMap", "").trim(); 
    document.getElementById(divId).className = className;
}



/*********************************************************
** 함수명 : fIsNone 
** 설 명  : 정의되어 있는지 확인한다. 
** 파라메터 : val : 체크 대상 값
**********************************************************/
function fIsNone(val){
    if(typeof val == "undefined"){
        return true; 
    }
    return false; 
}

/*********************************************************
** 함수명 : fIsNull
** 설 명  : 값이 null인지 체크한다. 
** 파라메터 : val : 체크 대상 값
** 반환값 : boolean : true : NULL 
**                   false : NOT NULL
**********************************************************/
function fIsNull(val){
    if(fIsNone(val)) return true; 
    if(val == null) return true; 
    if(val == "") return true; 

    return false; 
}

/*********************************************************
** 함수명 : fSetProperty
** 설 명  : obj에 해당 속성을 설정한다. 
** 파라메터 : obj : Object : 속성을 설정할 Object
**           propertyName : String : 속성명
**           property: varriant : 속성 값
**********************************************************/
function  fSetProperty(obj, propertyName, property){
    if(fIsNone(obj[propertyName])){
        fLog("해당 속성 없다 <" + propertyName + ">");
        return; 
    }
    obj[propertyName] = property; 
}

/*********************************************************
** 함수명 : fGetProperty
** 설 명  : obj에서 해당 속성을 반환한다. 
** 파라메터 : obj : Object : 속성을 설정할 Object
**           propertyName : String : 속성명
** 반환값 : varriant : 속성 값 속성이 없는 경우 null
**********************************************************/
function fGetProperty(obj, propertyName){
    if(fIsNone(obj[propertyName])){
        fLog("해당 속성 없다 <" + propertyName + ">");
        return null; 
    }
    return obj[propertyName]; 
}

/*********************************************************
** 함수명 : copyProperties 
** 설 명  : 객체의 프로퍼티를 복사한다. 
** 파라메터 : objTo : Object : 복사적용 Object 
**           objFrom : Object : 복사대상 Object
**********************************************************/
function fCopyProperties(objTo, objFrom){
    for(key in objFrom){
        if(!fIsNone(objTo[key])){
            objTo[key] = objFrom[key];
        } else {
            var tmplCode = ""; 
            if(!fIsNone(objTo['tmpltCode'])){
                tmplCode = "<" + objTo['tmpltCode'] + ">";
            }
            fLog("적용할 Object" + tmplCode + "에 해당 프로퍼티가 존재하지 않습니다 < 해당프로퍼티 : " + key + " >"); 
        }
    }
}

/*********************************************************
** 함수명 : fCopyData 
** 설 명  : 데이터를 복사한다. (Object)
** 파라메터 : objTo : Object : 복사적용 Object 
**           objFrom : Object : 복사대상 Object
**********************************************************/
function fCopyData(dataTo, dataFrom){
    for(var key in dataFrom){
        dataTo[key] = dataFrom[key];
    }
}

/*********************************************************
** 함수명 : fGetDataListMetaKey 
** 설 명  : 데이터 Object의 key를 반환한다. 
** 파라메터 : dataList : Array Of Object 
**********************************************************/
function fGetDataListMetaKey(dataList){
    var rtnValue = []; 

    var obj = dataList[0];
    for(var key in obj){
        rtnValue.push(key);
    }

    return rtnValue; 
}

/*********************************************************
** 함수명 : fDistinctValue 
** 설 명  : 객체배열에서 해당 키의 값을 그룹핑하여 반환한다. 
** 파라메터 : dataList : Object array : 객체배열
**           colName : String : 속성명 
** 반환값 : array : String 
** ex > dataList = [{color:'red', value:'#121212'},{color:'red', value:'#121'},{color:'blue', value:'#121212'}]
**      var arrKey = fDistinctValue(dataList, 'color');
**      arrKey는 ['red', 'blue']
**********************************************************/
function fDistinctValue(dataList, colName){
    var arrObj = new Array(); 
    dataList.map(function(d){
        var value = d[colName];
        if(arrObj.indexOf(value) < 0){
            arrObj.push(value);
        }
    });

    return arrObj; 
}


/*********************************************************
** 함수명 : fGroupByList  
** 설 명  : dataList에서 대이터를 그룹처리하여 반환한다. 
** 파라메터 : dataList : Object array : 객체배열
**           arrKey : String array : 그룹키 배열
**           columnInfo : XlbChartSelectColInfo : 추출될 컬럼 정보 
** 반환값 : dataList : Object array
** ex > var dataList = [{saleDate:'20190101', item:'RAM', cnt:20, amount:3000}, {saleDate:'20190102', item:'RAM', cnt:10, amount:1000}, {saleDate:'20190102', item:'CPUT', cnt:20, amount:5000}];
**      var arrKey = ["item"];
**      var columnInfo = new XlbChartSelectColInfo();
**      columnInfo.SUM('amount').SUM('cnt').MAX('saleDate');
**      fGroupByList(dataList, arrKey, columnInfo);
**********************************************************/
function fGroupByList(dataList, arrKey, columnInfo){

    var rtnValue = []; 

    for(var i=0; i < dataList.length; i++){
        
        var row = dataList[i];
        //그룹에 해당하는 체크값을 생성한다 
        var checkValue = ""; 
        for(var j=0; j < arrKey.length; j++){
            checkValue += "|" + row[arrKey[j]];
        }

        //반환 목록에서 해당 그룹값에 해당 건이 있는지 찾는다. 
        var rtnValue_row = null; 
        for(var j=0; j < rtnValue.length; j++){
            var tmpRow = rtnValue[j];
            if(tmpRow.xlbchart_group_key == checkValue){
                rtnValue_row = tmpRow; 
                rtnValue_row.xlbchart_group_cnt++; 
            }
        }

        //해당건이 없으면 반환목록에 등록한다. 
        if(rtnValue_row == null){
            rtnValue_row = {}; 
            rtnValue_row.xlbchart_group_key = checkValue;
            rtnValue_row.xlbchart_group_cnt = 1; 
            for(var k=0; k < arrKey.length; k++){
                rtnValue_row[arrKey[k]] = row[arrKey[k]];
            }
            
            rtnValue.push(rtnValue_row);
        }

        //컬럼을 추가한다. 
        for(var j=0; j < columnInfo.size(); j++){
            var befValue    = rtnValue_row[columnInfo.getKeyName(j)];
            var rowValue    = row[columnInfo.getKeyName(j)];

            if(fIsNull(rowValue)){
                continue; 
            }

            //실행 유형에 따라 데이터를 추가한다. 
            switch(columnInfo.getExType(j)){
                case _XLB_CHART_MAX_ : 
                    if(fIsNone(befValue)){
                        befValue = rowValue;
                    } else {
                        if(befValue < rowValue){
                            befValue = rowValue; 
                        }
                    }
                    break; 

                case _XLB_CHART_MIN_ : 
                    if(fIsNone(befValue)){
                        befValue = rowValue;
                    } else {
                        if(befValue > rowValue){
                            befValue = rowValue; 
                        }
                    }
                    break;     

                case _XLB_CHART_SUM_ : 
                	
                	rowValue = parseInt("" + rowValue); 
                	if(isNaN(rowValue)) rowValue = 0; 
                	
                    if(fIsNone(befValue)){
                        befValue = rowValue;
                    } else {
                         befValue += rowValue; 
                    }
                    break;     
                    
                case _XLB_CHART_AVG_ : 
                	rowValue = parseInt("" + rowValue); 
                	if(isNaN(rowValue)) rowValue = 0;
                	
                    if(fIsNone(befValue)){
                        befValue = rowValue;
                    } else {
                         befValue += rowValue; 
                    }
                    break;             

            }

            rtnValue_row[columnInfo.getKeyName(j)] = befValue;             
        }

    }

    

    //AVG 계산 
    for(var i=0; i < rtnValue.length; i++){
        var tmpRow = rtnValue[i];
        for(var j=0; j < columnInfo.size(); j++){
            switch(columnInfo.getExType(j)){
                case _XLB_CHART_AVG_ : //평균계산 
                    var rowValue    = tmpRow[columnInfo.getKeyName(j)];
                    var cnt         = tmpRow.xlbchart_group_cnt;
                    var value       = 0; 

                    //if(!fIsNull(rowValue)){
                        if(rowValue > 0){
                            value = rowValue / cnt; 
                            value = value * 100; 
                            value = Math.round(value);
                            value = value / 100; 
                            fLog(rowValue + " CNT : " + cnt  + " : " + value); 
                            tmpRow[columnInfo.getKeyName(j)] = value; 
                        }
                    //}
                    break;
            }

        }
    }

    return rtnValue; 
}

/*********************************************************
** 함수명 : fFilteredList  
** 설 명  : dataList에서 필터링된 리스트를 반환한다. 
** 파라메터 : dataList : Object array : 객체배열
**           filterColInfo : XlbChartFilterColInfo : 필터정보
** 반환값 : dataList : Object array
** ex > var dataList = [{saleDate:'20190101', item:'RAM', cnt:20, amount:3000}, {saleDate:'20190102', item:'RAM', cnt:10, amount:1000}, {saleDate:'20190102', item:'CPUT', cnt:20, amount:5000}];
**      var filterInfo = new XlbChartFilterColInfo();
**      filterInfo.append('item', 'RAM');
**      fFilteredList(dataList, filterInfo);
**********************************************************/ 
function fFilteredList(dataList, filterColInfo){
    var rtnValue = []; 
    for(var i=0; i < dataList.length; i++){
        var row = dataList[i];
      
        var bCheck = true; 
        for(var j=0; j < filterColInfo.size(); j++){
            var keyName = filterColInfo.getKeyName(j);
            var checkValues = filterColInfo.getFilterValue(j).split(_XLB_CHART_OR_);
            
            var listValue = row[keyName];
            var bCheck2 = false; 
            for(var k=0; k < checkValues.length; k++){
                var value = checkValues[k];
                //fLog("비교대상 : " + listValue + "     비교 :: " + value); 
                if(listValue == value){
                    bCheck2 = true; 
                    break; 
                }
            }

            if(!bCheck2){
                bCheck = false; 
                break; 
            }
        }

        if(bCheck){
            var rtnObj = {}; 
            fCopyData(rtnObj, row);
            rtnValue.push(rtnObj);
        }
    }

    return rtnValue; 
}

/*********************************************************
** 함수명 : fSleep 
** 설 명  : sleep 처리 
** 파라메터 : msecs : number : 1000 = 1초
**********************************************************/
function fSleep(msecs){
    fLog("fSleep 실행 ::" + msecs);
    var start   = new Date().getTime();
    var now     = start; 
          
    while(now - start < msecs){
        now = new Date().getTime();
    }     
}

/*********************************************************
** 함수명 : fSort
** 설 명  : sort 처리
**********************************************************/
function fSort(exData, sortInfo) {
    exData.sort(function (a, b) {
        for (var i = 0; i < sortInfo.size(); i++) {
            var aValue = a[sortInfo.getKeyName(i)];
            var bValue = b[sortInfo.getKeyName(i)];

            if (typeof aValue == "number" && typeof aValue == typeof bValue) {
                if(fIsNull(aValue)){
                    aValue = 0;
                }
                if(fIsNull(bValue)){
                    bValue = 0; 
                }

                if (aValue != bValue) {
                    if(sortInfo.exType[sortInfo.getKeyName(i)] == _XLB_CHART_ASC_) {
                        return aValue - bValue;
                    } else if(sortInfo.exType[sortInfo.getKeyName(i)] == _XLB_CHART_DESC_) {
                        return bValue - aValue;
                    }
                }
            } else if (typeof aValue == "string" ||
                       typeof bValue == "string" ||
                       typeof aValue != typeof bValue ) {
                if(fIsNull(aValue)){
                    aValue = "";
                }
                if(fIsNull(bValue)){
                    bValue = ""; 
                }
    
                if(aValue.localeCompare(bValue) != 0) {
                    if(sortInfo.exType[sortInfo.getKeyName(i)] == _XLB_CHART_ASC_) {
                        return aValue.localeCompare(bValue);
                    } else if(sortInfo.exType[sortInfo.getKeyName(i)] == _XLB_CHART_DESC_) {
                        return bValue.localeCompare(aValue);
                    }
                }
            }
        }
    });

    return exData;
}


/*********************************************************
** 함수명 : fGetFilteredMeta
** 설 명  : 메타정보를 반환한다.
** 파라메터 : masterMeta : array Of colInfo : 메타정보
**           arrColumnId : array Of String : 추출할 컬럼 정보 
**********************************************************/
function fGetFilteredMeta(masterMeta, arrColumnId){
    var rtnValue = []; 
    for(var i=0; i < arrColumnId.length; i++){
        for(var j=0; j < masterMeta.length; j++){
            var colInfo = masterMeta[j];
            if(colInfo.colId == arrColumnId[i]){
                var obj = {}; 
                fCopyData(obj,colInfo);
                obj.seq = i; 
                rtnValue.push(obj); 
            }
        }
    }
    return rtnValue;
}

/*********************************************************
** 함수명 : fGetMetaColInfo
** 설 명  : colId에 해당하는 메타 컬럼정보를 반환한다. 
** 파라메터 : masterMeta : array Of colInfo : 메타정보
**           colId : String : 컬럼ID 
**********************************************************/
function fGetMetaColInfo(masterMeta, colId){
    for(var j=0; j < masterMeta.length; j++){
        var colInfo = masterMeta[j];
        if(colInfo.colId == colId){
            var obj = {}; 
            fCopyData(obj,colInfo);
            return obj; 
        }
    }

    return null; 
}

/*********************************************************
** 함수명 : fGetMetaColNm
** 설 명  : colId에 해당하는 컬럼명을 반환한다. 
** 파라메터 : masterMeta : array Of colInfo : 메타정보
**           colId : String : 컬럼ID 
**********************************************************/
function fGetMetaColNm(masterMeta, colId){
    var obj = fGetMetaColInfo(masterMeta, colId);
    if(fIsNull(obj)) 
        return ""; 
    else
        return obj.colNm; 

}


/*********************************************************
 ** 함수명 : fGetChartBinary
 ** 설 명  : 차트를 이미지로 변환하기 위한 이미지 binary 반환 
 **********************************************************/
function fGetChartBinary(svgId){
    var svg = d3.select('#' + svgId );
    var tag = svg.node(); 
    var serializer = new XMLSerializer();
    var svgStr = serializer.serializeToString(tag);
    return 'data:image/svg+xml;base64,'+ window.btoa(unescape(encodeURIComponent(svgStr)));
}
