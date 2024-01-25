

export const filesArray: string[] = [];

filesArray.push(`PROGRAM hello (output);

{Write 'Hello, world.' ten times.}

VAR
    i : integer;

BEGIN {hello}
    FOR i := 1 TO 10 DO BEGIN
        writeln('Hello, world.');
    END;
END {hello}.
`);

filesArray.push(`{This is a comment.}

{This is a comment
 that spans several
 source lines.}

Two{comments in}{a row} here

{Word tokens}
Hello world
begin BEGIN Begin BeGiN begins

{String tokens}
'Hello, world.'
'It''s Friday!'
''
' '' '' '   ''''''
'This string
spans
source lines.'

{Special symbol tokens}
+ - * / := . , ; : = <> < <= >= > ( ) [ ] { } } ^ ..
+-:=<>=<==.....

{Number tokens}
0 1 20 00000000000000000032  31415926
3.1415926  3.1415926535897932384626433
0.00031415926E4  0.00031415926e+00004  31415.926e-4
3141592600000000000000000000000e-30

{Decimal point or ..}
3.14  3..14

{Bad tokens}
123e99  123456789012345  1234.56E.  3.  5..  .14  314.e-2
What?
'String not closed
`);

filesArray.push(`PROGRAM newton (input, output);

CONST
    EPSILON = 1e-6;

VAR
    number       : integer;
    root, sqRoot : real;

BEGIN
    REPEAT
        writeln;
        write('Enter new number (0 to quit): ');
        read(number);

        IF number = 0 THEN BEGIN
            writeln(number:12, 0.0:12:6);
        END
        ELSE IF number < 0 THEN BEGIN
            writeln('*** ERROR:  number < 0');
        END
        ELSE BEGIN
            sqRoot := sqrt(number);
            writeln(number:12, sqRoot:12:6);
            writeln;

            root := 1;
            REPEAT
                root := (number/root + root)/2;
                writeln(root:24:6,
                        100*abs(root - sqRoot)/sqRoot:12:2,
                        '%')
            UNTIL abs(number/sqr(root) - 1) < EPSILON;
        END
    UNTIL number = 0
END.
`);

filesArray.push(`BEGIN
    BEGIN {Temperature conversions.}
        five  := -1 + 2 - 3 + 4 - -3;
        ratio := five/9.0;

        fahrenheit := 72;
        centigrade := (((fahrenheit - 32)))*ratio;

        centigrade := 25;;;
        fahrenheit := centigrade/ratio + 32;

        centigrade := 25
        fahrenheit := 32 + centigrade/ratio;

        centigrade := 25;
        fahrenheit := celsius/ratio + 32
    END

    dze fahrenheit/((ratio - ratio) := ;

END.
`);

filesArray.push(`BEGIN
    BEGIN {Temperature conversions.}
        five  := -1 + 2 - 3 + 4 + 3;
        ratio := five/9.0;

        fahrenheit := 72;
        centigrade := (fahrenheit - 32)*ratio;

        centigrade := 25;
        fahrenheit := centigrade/ratio + 32;

        centigrade := 25;
        fahrenheit := 32 + centigrade/ratio
    END;

    {Runtime division by zero error.}
    dze := fahrenheit/(ratio - ratio);

    BEGIN {Calculate a square root using Newton's method.}
        number := 2;
        root := number;
        root := (number/root + root)/2;
    END;

    ch  := 'x';
    str := 'hello, world'
END.`
);

filesArray.push(`BEGIN
    BEGIN
        a := 0;
        b := 0;
        c := 0;
        d := 0;
        e := 0;
        f := a + b + c + d + e;
    END;

    BEGIN
        alpha := 10;
        beta := 20
    END;

    gamma := 30;

    BEGIN
        alpha  := -88; 
        beta   := 99;
        result := alpha + 3/(beta - gamma) + 5;
    END
END.
`);

filesArray.push(`BEGIN
    BEGIN {Temperature conversions.}
        five  := -1 + 2 - 3 + 4 + 3;
        ratio := five/9.0;

        fahrenheit := 72;
        centigrade := (fahrenheit - 32)*ratio;

        centigrade := 25;
        fahrenheit := centigrade/ratio + 32;

        centigrade := 25;
        fahrenheit := 32 + centigrade/ratio
    END;

    {Runtime division by zero error.}
    dze := fahrenheit/(ratio - ratio);

    BEGIN {Calculate a square root using Newton's method.}
        number := 2;
        root := number;
        root := (number/root + root)/2;
        root := (number/root + root)/2;
        root := (number/root + root)/2;
        root := (number/root + root)/2;
        root := (number/root + root)/2;
    END;

    ch  := 'x';
    str := 'hello, world'
END.
`);

filesArray.push(`BEGIN {REPEAT statements.}
    i := 0;

    REPEAT
        j := i;
        k := i
    UNTIL i <= j;

    BEGIN {Calculate a square root using Newton's method.}
        number := 4;
        root := number;

        REPEAT
            partial := number/root + root;
            root := partial/2
        UNTIL root*root - number < 0.000001
    END
END.
`);

filesArray.push(`BEGIN {REPEAT syntax errors}
    REPEAT UNTIL five := 5;
    REPEAT ratio := 9 UNTIL;
END.
`);

filesArray.push(`BEGIN {WHILE statements}
    i := 0;  j := 0;

    WHILE i > j DO k := i;

    BEGIN {Calculate a square root using Newton's method.}
        number := 2;
        root := number;

        WHILE root*root - number > 0.000001 DO BEGIN
            root := (number/root + root)/2
        END
    END;
END.
`);

filesArray.push(`BEGIN {WHILE syntax errors}
    WHILE DO five := 5;
    WHILE five = 5 five := 5 UNTIL five := 9;
END.
`);

filesArray.push(`BEGIN {FOR statements}
    j := 1;

    FOR k := j TO 5 DO n := k;

    FOR k := n DOWNTO 1 DO j := k;

    FOR i := 1 TO 2 DO BEGIN
        FOR j := 1 TO 3 DO BEGIN
            k := i*j
        END
    END
END.
`);

filesArray.push(`BEGIN {FOR syntax errors}
    FOR i := 1, 10 DO five := 5;
    FOR i = 10 DOWNTO 1 five = 5
END.
`);

filesArray.push(`BEGIN {IF statements}
    i := 3;  j := 4;

    IF i = j THEN t := 200
             ELSE f := -200;

    IF i < j THEN t := 300;

    {Cascading IF THEN ELSEs.}
    IF      i = 1 THEN f := 10
    ELSE IF i = 2 THEN f := 20
    ELSE IF i = 3 THEN t := 30
    ELSE IF i = 4 THEN f := 40
    ELSE               f := -1;

    {The "dandling ELSE".}
    IF i = 3 THEN IF j = 2 THEN t := 500 ELSE f := -500;
END.
`);

filesArray.push(`BEGIN {IF syntax errors}
    i := 0;

    IF i = 5;
    IF i := 5 ELSE j := 9;
    IF i = 5 ELSE j := 9 THEN j := 7;
END.
`);

filesArray.push(`BEGIN {CASE statements}
    i := 3;  ch := 'b';

    CASE i+1 OF
        1:       j := i;
        4:       j := 4*i;
        5, 2, 3: j := 523*i;
    END;

    CASE ch OF
        'c', 'b' : str := 'p';
        'a'      : str := 'q'
    END;

    FOR i := -5 TO 15 DO BEGIN
        CASE i OF
            2: prime := i;
            -4, -2, 0, 4, 6, 8, 10, 12: even := i;
            -3, -1, 1, 3, 5, 7, 9, 11:  CASE i OF
                                            -3, -1, 1, 9:   odd := i;
                                            2, 3, 5, 7, 11: prime := i;
                                        END
        END
    END
END.
`);

filesArray.push(`BEGIN {CASE syntax errors}
    i := 0;  ch := 'x';  str := 'y';

    CASE i OF
        1 2 3: j := i;
        4,1,5  IF j = 5 THEN k := 9;
    END;

    CASE ch1 OF
        'x', 'hello', 'y': str := 'world';
        'z', 'x':          str := 'bye'
    END
END.
`);

filesArray.push(`CONST
    ten = 10;
    epsilon = 1.0E-6;
    x = 'x';
    limit = -epsilon;
    hello = 'Hello, world!';

TYPE
    range1 = 0..ten;
    range2 = 'a'..'q';
    range3 = range1;

    enum1 = (a, b, c, d, e);
    enum2 = enum1;
    range4 = b..d;

    week = (monday, tuesday, wednesday, thursday, friday, saturday, sunday);
    weekday = monday..friday;
    weekend = saturday..sunday;

    ar1 = ARRAY [range1] OF integer;
    ar2 = ARRAY [(alpha, beta, gamma)] OF range2;
    ar3 = ARRAY [enum2] OF ar1;
    ar4 = ARRAY [range3] OF (foo, bar, baz);
    ar5 = ARRAY [range1] OF ARRAY[range2] OF ARRAY[c..e] OF enum2;
    ar6 = ARRAY [range1, range2, c..e] OF enum2;

    rec1 = RECORD
               i : integer;
               r : real;
               b1, b2 : boolean;
               c : char
           END;

    ar7 = ARRAY [range2] OF RECORD
                                ten : integer;
                                r : rec1;
                                a : ARRAY[range4] OF range2;
                            END;

VAR
    var1 : integer;
    var2, var3 : range2;
    var4 : enum2;
    var5, var6, var7 : -7..ten;
    var8 : (fee, fye, foe, fum);
    var9 : range3;

    var10 : rec1;
    var11 : RECORD
                b : boolean;
                r : RECORD
                        aa : ar1;
                        bb : boolean;
                        r  : real;
                        v1 : ar6;
                        v2 : ARRAY [enum1, range1] OF ar7;
                    END;
                a : ARRAY [1..5] OF boolean;
            END;

    var12 : ar1;
    var15 : ar5;
    var16 : ar6;

    number : range1;
    root : real;

BEGIN
END.
`);

filesArray.push(`CONST
    ten = 10;
    epsilon = 1.0E-6;
    delta = epsilon/2;
    pi = pi;

TYPE
    typp = typp;
    range1 = 0..tenn;
    range3 = 0..10.0;
    range5 = 'q'..'p';
    range6 = foo..bar;

    enum1 = (a, b, c, d, e)
    range3 = e..c;

    ar1 = ARRAY [integer] OF integer;
    ar4 = ARRAY [(foo, bar, baz)] OF (foo, bar);

    rec1 = RECORD
               i : integer;
               r : real;
               i : boolean;
           END;

    ar5 = ARRAY [range2] RECORD
                             rec : RECORD;
                         END;

VAR
    var2 : range2;
    var4 : ten..5;
    var5 : (fee, fye, foe, FYE, fum);

BEGIN
END.
`);

filesArray.push(`CONST
    seven =  7;
    ten   = 10;

TYPE
    range1 = 0..ten;
    range2 = 'a'..'q';
    range3 = range1;

    enum1 = (a, b, c, d, e);
    enum2 = enum1;

    range4 = b..d;

    arr1 = ARRAY [range1] OF real;
    arr2 = ARRAY [(alpha, beta, gamma)] OF range2;
    arr3 = ARRAY [enum2] OF arr1;
    arr4 = ARRAY [range3] OF (foo, bar, baz);
    arr5 = ARRAY [range1] OF ARRAY[range2] OF ARRAY[c..e] OF enum2;
    arr6 = ARRAY [range1, range2, c..e] OF enum2;

    rec7 = RECORD
               i : integer;
               r : real;
               b1, b2 : boolean;
               c : char
           END;

    arr8 = ARRAY [range2] OF RECORD
                                 fldi  : integer;
                                 fldr : rec7;
                                 flda : ARRAY[range4] OF range2;
                             END;

VAR
    var1 : arr1;  var5 : arr5;
    var2 : arr2;  var6 : arr6;
    var3 : arr3;  var7 : rec7;
    var4 : arr4;  var8 : arr8;

    var9 : RECORD
               b   : boolean;
               rec : RECORD
                         fld1 : arr1;
                         fldb : boolean;
                         fldr : real;
                         fld6 : arr6;
                         flda : ARRAY [enum1, range1] OF arr8;
                     END;
               a : ARRAY [1..5] OF boolean;
           END;

BEGIN
    var1[5] := 3.14;
    var1[var7.i] := var9.rec.flda[e, ten]['q'].fldi;

    IF var9.a[seven-3] THEN var2[beta] := 'x';

    CASE var4[var8['m'].fldi - 4] OF
        foo:      var3[e][3] := 12;
        bar, baz: var3[b] := var1;
    END;

    REPEAT
        var5[3] := var5[4];
        var5[3, 'a'] := var5[4]['f'];
        var5[3, 'a', c] := var6[4, 'f'][d];
    UNTIL var6[3, 'a', c] > var5[4]['f', d];

    WHILE var7.i <> var9.rec.fldr DO BEGIN
        var7.r := var8['g'].fldr.r;
    END;

    var6[3] := var6[4];
    var6[3, 'a'] := var6[4]['f'];

    var9.rec.fld6[4]['f'][d] := e;
    var9.rec.fld6[4, 'f'][d] := e;
    var9.rec.flda[b, 0, 'm'].flda[d] := 'p';
    var9.rec.flda[b][0, 'm'].flda[d] := 'p';
END.
`);

filesArray.push(`CONST
    Seven =  7;
    Ten   = 10;

TYPE
    range1 = 0..ten;
    range2 = 'a'..'q';
    range3 = range1;

    enum1 = (a, b, c, d, e);
    enum2 = enum1;

    range4 = b..d;

    arr1 = ARRAY [range1] OF real;
    arr2 = ARRAY [(alpha, beta, gamma)] OF range2;
    arr3 = ARRAY [enum2] OF arr1;
    arr4 = ARRAY [range3] OF (foo, bar, baz);
    arr5 = ARRAY [range1] OF ARRAY[range2] OF ARRAY[c..e] OF enum2;
    arr6 = ARRAY [range1, range2, c..e] OF enum2;

    rec7 = RECORD
               i : integer;
               r : real;
               b1, b2 : boolean;
               c : char
           END;

    arr8 = ARRAY [range2] OF RECORD
                                 fldi  : integer;
                                 fldr : rec7;
                                 flda : ARRAY[range4] OF range2;
                             END;

VAR
    var1 : arr1;  var5 : arr5;
    var2 : arr2;  var6 : arr6;
    var3 : arr3;  var7 : rec7;
    var4 : arr4;  var8 : arr8;

    var9 : RECORD
               b   : boolean;
               rec : RECORD
                         fld1 : arr1;
                         fldb : boolean;
                         fldr : real;
                         fld6 : arr6;
                         flda : ARRAY [enum1, range1] OF arr8;
                     END;
               a : ARRAY [1..5] OF boolean;
           END;

BEGIN
    var2[a] := 3.14;
    var1[var7.i] := var9.rec.flda['e', ten]['q'].fldr;

    IF var9.rec.fldr THEN var2[beta] := seven;

    CASE var5[seven, 'm', d]  OF
        foo:      var3[e] := 12;
        bar, baz: var3[b] := var1.rec.fldb;
    END;

    REPEAT
        var7[3] := a;
    UNTIL var6[3, 'a', c] + var5[4]['f', d];

    var9.rec.flda[b][0, 'm', foo].flda[d] := 'p';
END.
`);