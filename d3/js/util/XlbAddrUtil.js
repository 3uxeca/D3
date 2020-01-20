/*
############################################################################
## 작성일 : 2019.08.29
## 작성자 : 정호승C
## 설 명  : 주소관련 Util 
############################################################################
*/
var _XLB_ADDR_LEVEL_ALL_ = 0;
var _XLB_ADDR_LEVEL_TOP_ = 1;
var _XLB_ADDR_LEVEL_MIDDLE_ = 2;
var _XLB_ADDR_LEVEL_BOTTOM_ = 3;


/*********************************************************
** 함수명 : fCvrtAddrToDataList
** 설 명  : 주소정보를 변환하여 데이터 리스트에 추가한다. 
** 파라메터 : dataList : arr of object 
**           addrColName : String : 변환할 컬럼
**           addrLevel : NUMBER : 변환 범위 
**********************************************************/
function fCvrtAddrToDataList(dataList, addrColName, addrLevel){
    var tmpDataList = JSON.parse(JSON.stringify(dataList)); 
    for(var i=0; i < tmpDataList.length; i++){
        var row = tmpDataList[i];
        var addr = row[addrColName];
        if(fIsNull(addr)) {
            row["xlb_chart_addr_pos"] = ""; 
            continue; 
        }
        var arrAddr = addr.split(" ");

        var tmpAddr = []; 
        for(var j=0; j < arrAddr.length; j++){
            if(!fIsNull(arrAddr[j])){
                tmpAddr.push(arrAddr[j]);
            }
        }

        function getAddr(arr, level){
            var rtnValue = "";
            for(var idx=0; idx < arr.length; idx++){
                if(!fIsNull(rtnValue)) rtnValue += " ";
                rtnValue += arr[idx];
                if(level == _XLB_ADDR_LEVEL_ALL_) continue; 
                if(idx == (level - 1)) break; 

            }

            return rtnValue; 
        }

        row["xlb_chart_addr_pos"] = getAddr(tmpAddr, addrLevel);
    }

    return tmpDataList;
}

/*********************************************************
** 함수명 : fGetTmapPos
** 설 명  : TMAP에서 경도 위도를 반환한다. 
** 파라메터 : addr : String : 주소 
**********************************************************/
function fGetTmapPos(addr){
	

	
	//var oldDomain = document.domain;
	//fLog("fGetTmapPos : 실행 " + addr + " domain :: " + oldDomain);
	//document.domain = "sk.com"; 
    var rtnObj = {}; 
    rtnObj.lon = -1; 
    rtnObj.lat = -1; 
    rtnObj.errMessage = ""; 
    $.ajax(
        {
            method:"GET",
            url:"https://apis.openapi.sk.com/tmap/pois?version=1&format=xml&callback=result",// POI 통합검색 api 요청 url입니다.
            async:true,
            data:{
                "searchKeyword" : addr,//검색 키워드
                "resCoordType" : "EPSG3857",//응답 좌표계 유형
                "reqCoordType" : "WGS84GEO",//요청 좌표계 유형
                "appKey" : _XLB_CHART_TMAP_KEY_,// 실행을 위한 키입니다. 발급받으신 AppKey(서버키)를 입력하세요.
                "count" : 1//페이지당 출력되는 개수를 지정
            },
            
            success:function(response){
            	
                prtcl = response;
                var prtclString = new XMLSerializer().serializeToString(prtcl);//xml to String	
                xmlDoc = $.parseXML( prtclString ),
                $xml = $( xmlDoc ),
                $intRate = $xml.find("poi");
                $intRate.each(function(index, element) {
                    
                    rtnObj.lon = element.getElementsByTagName("noorLon")[0].childNodes[0].nodeValue;
                    rtnObj.lat = element.getElementsByTagName("noorLat")[0].childNodes[0].nodeValue;
                    return rtnObj; 
                });
                
            },
            error:function(request,status,error){ rtnObj.errMessage = "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error;}
            
        }

    );     
     

    return rtnObj; 
}


/*
############################################################################
## 작성일 : 2019.08.30
## 작성자 : 정호승
## Object : XlbChartSelectColInfo
## 설 명  : 데이터 추출 정보
############################################################################
*/
var XlbTmapPoi = function(tmapPoiObjName){
	
	this.tmapPoiObjName = tmapPoiObjName;
	this.exCallBackFunc;
	this.addr; 
	this.exMasterCollBackFunc;
	
	 /*********************************************************
	 ** 함수명 : getTmapPos_Async
	 ** 설 명  : POI를 조회한다 Async 
	 ** 파라메터: addr : 주소
	 *         exCallBackFunc : 콜백함수  
	 **********************************************************/
	this.getTmapPos_Async = function(addr, exCallBackFunc, exMasterCollBackFunc){
		
		this.addr = addr;
		this.exCallBackFunc = exCallBackFunc;
		this.exMasterCollBackFunc = exMasterCollBackFunc;
		
		var tmpTmapPoiObjName = this.tmapPoiObjName; 

		
		//var oldDomain = document.domain;
		//fLog("fGetTmapPos : 실행 " + addr + " domain :: " + oldDomain);
		//document.domain = "sk.com";
	    $.ajax(
	        {
	            method:"GET",
	            url:"https://apis.openapi.sk.com/tmap/pois?version=1&format=javascript&callback=_M_POI_VAR_['" + this.tmapPoiObjName + "'].result",// POI 통합검색 api 요청 url입니다.
	            async:true,
	            crossDomain:true,
	            contentType:'application/javascript',
	            dataType:'jsonp',
	            data:{
	                "searchKeyword" : addr,//검색 키워드
	                "resCoordType" : "EPSG3857",//응답 좌표계 유형
	                "reqCoordType" : "WGS84GEO",//요청 좌표계 유형
	                "appKey" : _XLB_CHART_TMAP_KEY_,// 실행을 위한 키입니다. 발급받으신 AppKey(서버키)를 입력하세요.
	                "count" : 1//페이지당 출력되는 개수를 지정
	            },
	            
	            success:function(response){
	            	//callback 함수가 자동으로 호출 됨. this.result
	            },
	            error:function(request,status,error){ 
	            	
	            										if(request.status != 200){
	            											var errMessage = "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error;
	            											
		            										fLog(errMessage);
	            											var objRtn = {lon:-1, lat:-1};
	            											exCallBackFunc(tmpTmapPoiObjName, addr, objRtn, exMasterCollBackFunc);
	            										}
	                                                }
	            
	        }

	    );
	};
	
	/*********************************************************
	 ** 함수명 : result
	 ** 설 명  : 결과를 처리한다.   
	 **********************************************************/
	this.result = function(data){
		var objRtn = {lon:-1, lat:-1};
		if(data.searchPoiInfo.pois.poi.length > 0){
			objRtn.lon = data.searchPoiInfo.pois.poi[0].frontLon;
			objRtn.lat = data.searchPoiInfo.pois.poi[0].frontLat;
		}
		this.exCallBackFunc(this.tmapPoiObjName, this.addr, objRtn, this.exMasterCollBackFunc);
	};
	
}; 

//POI 전역변수 
var _M_POI_VAR_ = {};


/*********************************************************
 ** 함수명 : fGetTmapPoiObject
 ** 설 명  : XlbTmapPoi를 전역변수(_M_POI_VAR_)에 등록하고 반환한다.    
 **********************************************************/
function fGetTmapPoiObject(){
	var date = new Date(); 
	var aftVal = "" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
	
	var name = "POI_GLV_" + aftVal;
	var obj = new XlbTmapPoi(name);
	
	_M_POI_VAR_[name] = obj; 
	
	return obj; 
};

/*********************************************************
 ** 함수명 : fClearTmapPoiObject
 ** 설 명  : 전역변수(_M_POI_VAR_)에서 해당 object를 null처리 한다.     
 **********************************************************/
function fClearTmapPoiObject(tmapPoiObject){
	
	if(typeof tmapPoiObject == "object"){
		_M_POI_VAR_[tmapPoiObject.tmapPoiObjName] = null;
	} else {
		_M_POI_VAR_[tmapPoiObject] = null;
	}
}

//테스트 
function fRecall(){
	var obj = fGetTmapPoiObject();
	obj.getTmapPos_Async( "서울시 마포구", function(tmapPoiObjName, addr,data){alert(tmapPoiObjName + " :: " + addr + " :: " + data);});
}
