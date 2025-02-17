import { BundlerInternals } from "@remotion/bundler";
import fs from "fs";
import { tmpdir } from "os";
import path from "path";
import { describe, expect, test } from "vitest";

test("Should not be able to bundle @remotion/lambda directly", async () => {
  expect(() =>
    BundlerInternals.esbuild.build({
      platform: "node",
      target: "node16",
      bundle: true,
      entryPoints: [require.resolve("@remotion/lambda")],
      logLevel: "silent",
    })
  ).rejects.toThrow(/Could not resolve "pnpapi"/);
});

describe("Should be able to bundle @remotion/lambda/client with ESBuild", () => {
  const outfile = path.join(tmpdir(), "esbuild-test.js");

  test("Should build without errors", async () => {
    const { errors, warnings } = await BundlerInternals.esbuild.build({
      platform: "node",
      target: "node16",
      bundle: true,
      outfile,
      entryPoints: [require.resolve("@remotion/lambda/client")],
    });
    expect(errors.length).toBe(0);
    expect(warnings.length).toBe(0);

    // Should not include remotion or react
    const contents = fs.readFileSync(outfile, "utf-8");
    expect(contents.includes("jsx-runtime")).toBe(false);
  });

  test("Bundle should be below 6MB", async () => {
    const file = await fs.promises.readFile(outfile, "utf-8");
    expect(file.length).toBeGreaterThan(10000);
    expect(file.length).toBeLessThanOrEqual(6000000);
  });

  test("Bundle should not include Renderer", async () => {
    const file = await fs.promises.readFile(outfile, "utf-8");
    expect(file).not.toContain("@remotion/renderer");
  });

  test("Should be able to delete it", () => {
    fs.unlinkSync(outfile);
  });
});
