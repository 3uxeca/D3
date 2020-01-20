/*
############################################################################
## 작성일 : 2019.08.30
## 작성자 : 정호승
## Object : XlbChartSelectColInfo
## 설 명  : 데이터 추출 정보
############################################################################
*/
var _XLB_CHART_MAX_ = "MAX"; //MAX값 산출 
var _XLB_CHART_MIN_ = "MIN"; //MIN값 산출 
var _XLB_CHART_SUM_ = "SUM"; //SUM값 산출 
var _XLB_CHART_AVG_ = "AVG"; //AVG값 산출 

var _XLB_CHART_PIPE1_ = "|_XLB_CHART_PIPE1_|";
var _XLB_CHART_PIPE2_ = "|_XLB_CHART_PIPE2_|";
var _XLB_CHART_OR_    = "|_XLB_CHART_OR_|"; //OR구분자 추가

var _XLB_CHART_ASC_ = "ASC";   //오름차순 정렬
var _XLB_CHART_DESC_ = "DESC"; //내림차순 정렬

var XlbChartSelectColInfo = function(){
    this.arrColKey  = []; 
    this.exType  = {};

    /*********************************************************
    ** 함수명 : MAX
    ** 설 명  : 해당키값을 MAX로 설정한다. 
    ** 파라메터: keyName : 키(속성) 명 
    **********************************************************/
    this.MAX = function(keyName){
        if(this.arrColKey.indexOf(keyName) < 0){
            this.arrColKey.push(keyName);
            this.exType[keyName] = _XLB_CHART_MAX_;
        }

        return this;
    };

    /*********************************************************
    ** 함수명 : MIN
    ** 설 명  : 해당키값을 MIN로 설정한다. 
    ** 파라메터: keyName : 키(속성) 명 
    **********************************************************/
    this.MIN = function(keyName){
        if(this.arrColKey.indexOf(keyName) < 0){
            this.arrColKey.push(keyName);
            this.exType[keyName] = _XLB_CHART_MIN_;
        }

        return this;
    };

    /*********************************************************
    ** 함수명 : SUM
    ** 설 명  : 해당키값을 SUM로 설정한다. 
    ** 파라메터: keyName : 키(속성) 명 
    **********************************************************/
    this.SUM = function(keyName){
        if(this.arrColKey.indexOf(keyName) < 0){
            this.arrColKey.push(keyName);
            this.exType[keyName] = _XLB_CHART_SUM_;
        }

        return this;
    };

    /*********************************************************
    ** 함수명 : AVG
    ** 설 명  : 해당키값을 AVG로 설정한다. 
    ** 파라메터: keyName : 키(속성) 명 
    **********************************************************/
    this.AVG = function(keyName){
        if(this.arrColKey.indexOf(keyName) < 0){
            this.arrColKey.push(keyName);
            this.exType[keyName] = _XLB_CHART_AVG_;
        }

        return this;
    };

    /*********************************************************
    ** 함수명 : getKeyName
    ** 설 명  : index에 해당하는 키값을 반환한다.  
    ** 파라메터: index : 키순번
    **********************************************************/
    this.getKeyName = function(index){
        return this.arrColKey[index];
    };

    /*********************************************************
    ** 함수명 : getExType
    ** 설 명  : 실행 타입 반환 
    ** 파라메터: key : String : 키(속성명) 또는 index : number : 순번 
    **********************************************************/
    this.getExType = function(key){
        var keyName = key; 
        if(typeof key == "number"){
            keyName = this.getKeyName(key);
        }

        return this.exType[keyName];
    };

    /*********************************************************
    ** 함수명 : size
    ** 설 명  : 설정된 키(속성) 크기 반환
    ** 파라메터: 
    **********************************************************/
    this.size = function(){
        return this.arrColKey.length; 
    };

    /*********************************************************
    ** 함수명 : toString
    ** 설 명  : 해당 정보를 String으로 반환한다. 
    ** 파라메터: 
    **********************************************************/
    this.toString = function(){
        var rtnValue = ""; 
        for(var i=0; i < this.arrColKey.length; i++){
            if(rtnValue != "")
                rtnValue += _XLB_CHART_PIPE1_;
            rtnValue += this.arrColKey[i] + _XLB_CHART_PIPE2_ + this.exType[this.arrColKey[i]];
        }

        return rtnValue; 
    };

    /*********************************************************
    ** 함수명 : setSelectColInfo
    ** 설 명  : 문자열로 된 컬럼정보를 객체로 변경한다. 
    ** 파라메터: colInfo : String : 컬럼정보 문자열 
    **********************************************************/
    this.setSelectColInfo = function(colInfo){
        var arrValue = colInfo.split(_XLB_CHART_PIPE1_);
        for(var i=0; i < arrValue.length; i++){
            var tmpVal = arrValue[i];
            var arrCol = tmpVal.split(_XLB_CHART_PIPE2_);

            this.arrColKey.push(arrCol[0]);
            this.exType[arrCol[0]] = arrCol[1];
        }

        return this; 
    };
};

/*
############################################################################
## 작성일 : 2019.08.30
## 작성자 : 정호승
## Object : XlbChartFilterColInfo
## 설 명  : 데이터 필터처리 컬럼 정보
############################################################################
*/
var XlbChartFilterColInfo = function(){
    this.arrColKey = []; 
    this.filterValue = {}; 

    /*********************************************************
    ** 함수명 : append
    ** 설 명  : 필터를 추가한다. 
    ** 파라메터: keyName : String : 키(속성)명 
    **          filterValue : String : 필터 값
    **********************************************************/
    this.append = function(keyName, filterValue){
        if(this.arrColKey.indexOf(keyName) < 0){
            this.arrColKey.push(keyName);
            this.filterValue[keyName] = filterValue;
        } else {
            var value = this.filterValue[keyName];
            value += _XLB_CHART_OR_ + filterValue; 
            this.filterValue[keyName] = value; 
        }

        //fLog(this.filterValue[keyName]);
        
        return this;
    };

    /*********************************************************
    ** 함수명 : SUM
    ** 설 명  : index에 해당하는 키값을 반환한다.  
    ** 파라메터: keyName : 키(속성) 명 
    **********************************************************/
    this.getKeyName = function(index){
        return this.arrColKey[index];
    };

    /*********************************************************
    ** 함수명 : getFilterValue
    ** 설 명  : 실행 타입 반환 
    ** 파라메터: key : String : 키(속성명) 또는 index : number : 순번 
    **********************************************************/
    this.getFilterValue = function(key){
        var keyName = key; 
        if(typeof key == "number"){
            keyName = this.getKeyName(key) + "";
        }

        return this.filterValue[keyName];
    };

    /*********************************************************
    ** 함수명 : size
    ** 설 명  : 설정된 키(속성) 크기 반환
    ** 파라메터: 
    **********************************************************/
    this.size = function(){
        return this.arrColKey.length; 
    };

    /*********************************************************
    ** 함수명 : toString
    ** 설 명  : 해당 정보를 String으로 반환한다. 
    ** 파라메터: 
    **********************************************************/
    this.toString = function(){
        var rtnValue = ""; 
        for(var i=0; i < this.arrColKey.length; i++){
            if(rtnValue != "")
                rtnValue += _XLB_CHART_PIPE1_;
            rtnValue += this.arrColKey[i] + _XLB_CHART_PIPE2_ + this.exType[this.arrColKey[i]];
        }

        return rtnValue; 
    };

    /*********************************************************
    ** 함수명 : setFilterColInfo
    ** 설 명  : 문자열로 된 필터정보를 객체로 변경한다. 
    ** 파라메터: colInfo : String : 필터정보 문자열 
    **********************************************************/
    this.setFilterColInfo = function(colInfo){
        var arrValue = colInfo.split(_XLB_CHART_PIPE1_);
        for(var i=0; i < arrValue.length; i++){
            var tmpVal = arrValue[i];
            var arrCol = tmpVal.split(_XLB_CHART_PIPE2_);

            this.arrColKey.push(arrCol[0]);
            this.filterValue[arrCol[0]] = arrCol[1];
        }

        return this; 
    };

};


/*
############################################################################
## 작성일 : 2019.08.30
## 작성자 : 정호승
## Object : XlbChartColInfo
## 설 명  : 데이터리스트 컬럼 정보 
############################################################################
*/
var XlbChartColInfo = function(){
    this.colId      = ""; //COL_ID	컬럼명
    this.colNm   = ""; //COL_KOR_NM	컬럼한글명
    this.colTyp     = ""; //COL_TYP	컬럼유형
    this.seq        = ""; //SEQ	컬럼순번
    this.remark     = ""; //REMARK	비고
};

/*
############################################################################
## 작성일 : 2019.09.27
## 작성자 : 명재환
## Object : XlbChartSortColInfo
## 설 명  : 데이터 정렬처리 컬럼 정보
############################################################################
*/
var XlbChartSortColInfo = function(){
    this.arrColKey  = []; 
    this.exType  = {};

    /*********************************************************
    ** 함수명 : ASC
    ** 설 명  : 해당키값을 오름차순 정렬로 설정한다. 
    ** 파라메터: keyName : 키(속성) 명 
    **********************************************************/
    this.ASC = function(keyName){
        if(this.arrColKey.indexOf(keyName) < 0){
            this.arrColKey.push(keyName);
            this.exType[keyName] = _XLB_CHART_ASC_;
        } 

        return this;
    };

    /*********************************************************
    ** 함수명 : DESC
    ** 설 명  : 해당키값을 내림차순 정렬로 설정한다. 
    ** 파라메터: keyName : 키(속성) 명 
    **********************************************************/
    this.DESC = function(keyName){
        if(this.arrColKey.indexOf(keyName) < 0){
            this.arrColKey.push(keyName);
            this.exType[keyName] = _XLB_CHART_DESC_;
        }

        return this;
    };

    /*********************************************************
    ** 함수명 : getKeyName
    ** 설 명  : index에 해당하는 키값을 반환한다.  
    ** 파라메터: keyName : 키(속성) 명 
    **********************************************************/
    this.getKeyName = function(index){
        return this.arrColKey[index];
    };

    /*********************************************************
    ** 함수명 : getExType
    ** 설 명  : 실행 타입 반환 
    ** 파라메터: key : String : 키(속성명) 또는 index : number : 순번 
    **********************************************************/
    this.getExType = function(key){
        var keyName = key; 
        if(typeof key == "number"){
            keyName = this.getKeyName(key);
        }

        return this.exType[keyName];
    };

    /*********************************************************
    ** 함수명 : size
    ** 설 명  : 설정된 키(속성) 크기 반환
    ** 파라메터: 
    **********************************************************/
    this.size = function(){
        return this.arrColKey.length; 
    };

};