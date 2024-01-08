

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