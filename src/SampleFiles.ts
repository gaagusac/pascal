

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
