import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

process.env.ADMIN_EMAIL = "admin@test.tn";
process.env.ADMIN_PASSWORD = "Secret123";
process.env.SESSION_SECRET = "test-secret";
const { createStore } = await import("../store.js");
const { createApp } = await import("../index.js");

let server, base, dir, store, cookie = "";
const H = { "Content-Type": "application/json", "X-Requested-With": "fanni-admin" };
const req = (url, { method = "GET", body, auth = true } = {}) =>
  fetch(base + url, { method, headers: { ...H, ...(auth && cookie ? { Cookie: cookie } : {}) }, body: body && JSON.stringify(body) });

before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "fanni-"));
  store = await createStore({ databaseUrl: "", dataDir: dir });
  const app = await createApp({ store });
  await new Promise(r => { server = app.listen(0, r); });
  base = `http://localhost:${server.address().port}`;
});
after(async () => { server.close(); await store.close(); fs.rmSync(dir, { recursive: true, force: true }); });

test("le catalogue public est généré depuis la base", async () => {
  const js = await (await fetch(base + "/assets/js/data.js")).text();
  assert.match(js, /FANNI\.products = \[/);
});

test("l'admin refuse un mauvais mot de passe puis accepte le bon", async () => {
  assert.equal((await req("/api/admin/login", { method: "POST", body: { email: "admin@test.tn", password: "x" } })).status, 401);
  assert.equal((await req("/api/admin/products")).status, 401);
  const r = await req("/api/admin/login", { method: "POST", body: { email: "ADMIN@test.tn", password: "Secret123" } });
  assert.equal(r.status, 200);
  cookie = r.headers.get("set-cookie").split(";")[0];
});

test("un produit brouillon n'apparaît sur le site qu'une fois publié", async () => {
  const p = { name: { fr: "Box Test" }, price: 50, occasion: ["anniversaire"], published: false };
  const r = await req("/api/admin/products", { method: "POST", body: p });
  assert.equal(r.status, 201);
  const { id } = await r.json();
  assert.doesNotMatch(await (await fetch(base + "/assets/js/data.js")).text(), /Box Test/);
  assert.equal((await req(`/api/admin/products/${id}`, { method: "PUT", body: { ...p, published: true } })).status, 200);
  assert.match(await (await fetch(base + "/assets/js/data.js")).text(), /Box Test/);
});

test("validation : nom et prix obligatoires", async () => {
  assert.equal((await req("/api/admin/products", { method: "POST", body: { name: { fr: "" }, price: 0 } })).status, 400);
});

test("une commande du site arrive dans l'admin", async () => {
  const o = { orderNo: "FS-1", pay: "cod", items: [{ id: "x", name: "Box", price: 40, qty: 2 }], customer: { name: "Sarah", phone: "22123456", address: "12 rue", city: "Tunis" } };
  assert.equal((await req("/api/orders", { method: "POST", body: o, auth: false })).status, 201);
  const list = await (await req("/api/admin/orders")).json();
  assert.ok(list.some(x => x.orderNo === "FS-1"));
});

test("les fichiers internes ne sont pas servis", async () => {
  for (const u of ["/package.json", "/server/auth.js", "/data/"]) assert.equal((await fetch(base + u)).status, 404, u);
});
