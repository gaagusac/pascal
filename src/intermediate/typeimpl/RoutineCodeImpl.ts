import {RoutineCode} from "../RoutineCode.ts";


export class RoutineCodeImpl implements RoutineCode {

    _routineCodeMarker = true;

    public static DECLARED: RoutineCodeImpl;
    public static FORWARD: RoutineCodeImpl;
    public static READ: RoutineCodeImpl;
    public static READLN: RoutineCodeImpl;
    public static WRITE: RoutineCodeImpl;
    public static WRITELN: RoutineCodeImpl;
    public static ABS: RoutineCodeImpl;
    public static ARCTAN: RoutineCodeImpl;
    public static CHR: RoutineCodeImpl;
    public static COS: RoutineCodeImpl;
    public static EOF: RoutineCodeImpl;
    public static EOLN: RoutineCodeImpl;
    public static EXP: RoutineCodeImpl;
    public static LN: RoutineCodeImpl;
    public static ODD: RoutineCodeImpl;
    public static ORD: RoutineCodeImpl;
    public static PRED: RoutineCodeImpl;
    public static ROUND: RoutineCodeImpl;
    public static SIN: RoutineCodeImpl;
    public static SQR: RoutineCodeImpl;
    public static SQRT: RoutineCodeImpl;
    public static SUCC: RoutineCodeImpl;
    public static TRUNC: RoutineCodeImpl;

    static {

        RoutineCodeImpl.DECLARED = new RoutineCodeImpl("DECLARED");
        RoutineCodeImpl.FORWARD = new RoutineCodeImpl("FORWARD");
        RoutineCodeImpl.READ = new RoutineCodeImpl("READ");
        RoutineCodeImpl.READLN = new RoutineCodeImpl("READLN");
        RoutineCodeImpl.WRITE = new RoutineCodeImpl("WRITE");
        RoutineCodeImpl.WRITELN = new RoutineCodeImpl("WRITELN");
        RoutineCodeImpl.ABS = new RoutineCodeImpl("ABS");
        RoutineCodeImpl.ARCTAN = new RoutineCodeImpl("ARCTAN");
        RoutineCodeImpl.CHR = new RoutineCodeImpl("CHR");
        RoutineCodeImpl.COS = new RoutineCodeImpl("COS");
        RoutineCodeImpl.EOF = new RoutineCodeImpl("EOF");
        RoutineCodeImpl.EOLN = new RoutineCodeImpl("EOLN");
        RoutineCodeImpl.EXP = new RoutineCodeImpl("EXP");
        RoutineCodeImpl.LN = new RoutineCodeImpl("LN");
        RoutineCodeImpl.ODD = new RoutineCodeImpl("ODD");
        RoutineCodeImpl.ORD = new RoutineCodeImpl("ORD");
        RoutineCodeImpl.PRED = new RoutineCodeImpl("PRED");
        RoutineCodeImpl.ROUND = new RoutineCodeImpl("ROUND");
        RoutineCodeImpl.SIN = new RoutineCodeImpl("SIN");
        RoutineCodeImpl.SQR = new RoutineCodeImpl("SQR");
        RoutineCodeImpl.SQRT = new RoutineCodeImpl("SQRT");
        RoutineCodeImpl.SUCC = new RoutineCodeImpl("SUCC");
        RoutineCodeImpl.TRUNC = new RoutineCodeImpl("TRUNC");
    }
    constructor(private readonly text: string) {
        this.text = text;
    }

    public valueOfRoutineCodeImpl(): string {
        return this.text;
    }

    public toString(): string {
        return this.text.toLowerCase();
    }
}