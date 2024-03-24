export function CSVToArray( strData: string, strDelimiter?: string ){
    strDelimiter = (strDelimiter || ",");

    const objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    let arrData: any[] = [[]];
    let arrMatches: RegExpExecArray | null = null;

    while (arrMatches = objPattern.exec( strData )){
        const strMatchedDelimiter = arrMatches[ 1 ];

        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ) {
            arrData.push( [] );
        }

        let strMatchedValue: string | null;

        if (arrMatches[ 2 ]){
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );

        } else {
            strMatchedValue = arrMatches[ 3 ];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    return arrData;
}