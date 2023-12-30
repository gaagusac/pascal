

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
filesArray.push('file #2');