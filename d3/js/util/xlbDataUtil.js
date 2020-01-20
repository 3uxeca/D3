/*
############################################################################
## 작성일 : 2019.09.23
## 작성자 : 한준구D
## 설 명  : 데이터 Util 클래스 
############################################################################
*/

/*********************************************************
** 함수명 : fOpenTextFile
** 설 명  : csv 파일 로딩
** 파라메터 : 
**********************************************************/
function fOpenTextFile() {
    var input = document.createElement("input");
 
    input.type = "file";
    input.accept = ".csv"; //"text/plain"; // 확장자가 xxx, yyy 일때, ".xxx, .yyy"
 
    input.onchange = function (event) {
        fProcessFile(event.target.files[0]);
    };
 
    input.click();
}


/*********************************************************
** 함수명 : fProcessFile
** 설 명  : 파일 open시에 내용 convert
** 파라메터 : 
**********************************************************/
function fProcessFile(file) {
    var reader = new FileReader();

    reader.onload = function () {
        var Result = reader.result;

        rtnObj = {};
        rtnObj.meta = [] ;
        rtnObj.data = [] ;

        d3.csvParse(Result, function(d, i) {

            /*meta obj->array*/
            arrayTmp = Object.keys(d); 
            // objTmp = {}; 

            if(i===0){
                for(var i=0; i<Object.keys(d).length; i++){
                    objTmp = new XlbChartColInfo();
                    objTmp.colId = 'col_' + (i+1);
                    objTmp.colNm = arrayTmp[i];
                    objTmp.colTyp = "CT01";
                    objTmp.seq = (i+1);
                    objTmp.remark = "";
                    rtnObj.meta.push(objTmp);
                }
                
            } /*Meta object array 생성.*/   

            var obj = {};
            for (var i = 0; i < rtnObj.meta.length; i++) {
                obj[rtnObj.meta[i].colId] = d[rtnObj.meta[i].colNm];

            }
            rtnObj.data.push(obj);
            
        }); 
        xlbChart.innerText = JSON.stringify(rtnObj);
        return rtnObj;     // {meta=[{colId:col1},{colNm:"A","colTyp: "컬타입",SEQ:1.."}...], data=[{col1:1,col2:2..},{},{}]}
    };


        reader.readAsText(file, /* optional */ "UTF-8");

}

 
// /*********************************************************
// ** 함수명 : fProcessFile
// ** 설 명  : 파일 open시에 내용 convert
// ** 파라메터 : 
// **********************************************************/
// function fProcessFile(file) {
//     var reader = new FileReader();
 
//     reader.onload = function () {
//         var Result = reader.result;

//         rtnObj = {};
//         rtnObj.data = [] ;

//         d3.csvParse(Result, function(d,i) {

//             rtnObj.meta = Object.keys(d);  

//             var obj = {};
//             for (var i = 0; i < rtnObj.meta.length; i++) {
//                 var str = 'col_' + (i+1); 
//                 obj[str] = d[rtnObj.meta[i]];

//             }
//             rtnObj.data.push(obj);
            
//         }); 
//         return rtnObj;     // {meta=[A,B,C,D], data=[{col1:1,col2:2..},{},{}]}
//     }


//         reader.readAsText(file, /* optional */ "UTF-8");

// };
