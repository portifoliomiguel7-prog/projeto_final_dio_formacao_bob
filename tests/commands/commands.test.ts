/**
 * Command handler tests.
 * Commands call process.exit(1) on error. We mock it to throw a special
 * sentinel error so execution stops at the guard, matching real behaviour.
 */

// Sentinel to differentiate intentional exits from unexpected throws
class ProcessExitError extends Error {
  constructor(public code: number) {
    super(`process.exit(${code})`);
  }
}

let mockLog: jest.SpyInstance;
let mockError: jest.SpyInstance;
let mockExit: jest.SpyInstance;

beforeEach(() => {
  mockLog = jest.spyOn(console, "log").mockImplementation(() => {});
  mockError = jest.spyOn(console, "error").mockImplementation(() => {});
  mockExit = jest
    .spyOn(process, "exit")
    .mockImplementation((code?: number | string | null) => {
      throw new ProcessExitError(Number(code ?? 0));
    }) as jest.SpyInstance;
});

afterEach(() => {
  mockLog.mockRestore();
  mockError.mockRestore();
  mockExit.mockRestore();
});

// ── /oportunidades ────────────────────────────────────────────────────────────

describe("command: oportunidades", () => {
  const { run } = require("../../src/commands/oportunidades");

  it("outputs the opportunity list to console.log", () => {
    run();
    expect(mockLog).toHaveBeenCalledTimes(1);
    const output: string = mockLog.mock.calls[0][0];
    expect(output).toContain("oportunidade(s)");
  });

  it("does not call process.exit on success", () => {
    run();
    expect(mockExit).not.toHaveBeenCalled();
  });
});

// ── /buscar ────────────────────────────────────────────────────────────────────

describe("command: buscar", () => {
  const { run } = require("../../src/commands/buscar");

  it("outputs results for a valid term", () => {
    run("TypeScript");
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("outputs no-results message for an unknown term", () => {
    run("angular-xyz-unknown");
    expect(mockLog).toHaveBeenCalledTimes(1);
    const output: string = mockLog.mock.calls[0][0];
    expect(output).toContain("Nenhuma oportunidade encontrada");
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("calls process.exit(1) when term is undefined", () => {
    expect(() => run(undefined)).toThrow(ProcessExitError);
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("calls process.exit(1) when term is empty string", () => {
    expect(() => run("")).toThrow(ProcessExitError);
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});

// ── /analisar ─────────────────────────────────────────────────────────────────

describe("command: analisar", () => {
  const { run } = require("../../src/commands/analisar");

  it("outputs analysis for a valid ID", () => {
    run("opp-001");
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("calls process.exit(1) for a non-existent ID", () => {
    expect(() => run("opp-999")).toThrow(ProcessExitError);
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("calls process.exit(1) when ID is undefined", () => {
    expect(() => run(undefined)).toThrow(ProcessExitError);
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});

// ── /proposta ─────────────────────────────────────────────────────────────────

describe("command: proposta", () => {
  const { run } = require("../../src/commands/proposta");

  it("outputs proposal for a valid ID", () => {
    run("opp-004");
    // proposta prints: divider, title line, divider, proposal text, divider = 5 calls
    expect(mockLog).toHaveBeenCalledTimes(5);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("proposal output contains the company name", () => {
    run("opp-004");
    const allOutput = mockLog.mock.calls.map((c) => c[0]).join("\n");
    expect(allOutput).toContain("Produto SaaS BR");
  });

  it("calls process.exit(1) for a non-existent ID", () => {
    expect(() => run("opp-999")).toThrow(ProcessExitError);
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("calls process.exit(1) when ID is undefined", () => {
    expect(() => run(undefined)).toThrow(ProcessExitError);
    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
