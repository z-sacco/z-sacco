const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DB_PATH = process.env.DATA_PATH ? path.resolve(process.env.DATA_PATH) : path.join(ROOT, "data", "db.json");
const DATA_DIR = path.dirname(DB_PATH);

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  || process.env.SUPABASE_ANON_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || "";

const PUBLIC_FILES = new Set(["/", "/index.html", "/styles.css", "/app.js"]);
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
};

function now() {
  return new Date().toISOString();
}

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    writeDb({
      saccos: [],
      admins: [
        {
          id: "admin_seed_1",
          saccoId: "seed",
          name: "Amina Kato",
          email: "admin@zsacco.coop",
          phone: "+256 700 000 000",
          passwordHash: hashPassword("zsacco"),
          linkedMemberId: "member_seed_1",
          createdAt: now(),
        },
      ],
      members: [
        {
          id: "member_seed_1",
          saccoId: "seed",
          memberNumber: "ZS-1001",
          name: "Amina Kato",
          phone: "+256 700 000 000",
          passwordHash: hashPassword("Member2026!"),
          createdAt: now(),
        },
      ],
      sessions: [],
      passwordResets: [],
      outbox: [],
      inquiries: [],
    });
  }
}

function readDb() {
  ensureDb();
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  let changed = false;
  for (const collection of ["saccos", "admins", "members", "sessions", "passwordResets", "outbox", "inquiries", "accounts", "transactions", "loans", "memberDocuments"]) {
    if (!Array.isArray(db[collection])) {
      db[collection] = [];
      changed = true;
    }
  }
  for (const member of db.members) {
    if (!db.accounts.some((account) => account.memberId === member.id)) {
      db.accounts.push({
        id: `account_${member.id}`,
        saccoId: member.saccoId,
        memberId: member.id,
        accountNumber: `SAV-${member.memberNumber}`,
        accountType: "Savings",
        balance: 0,
        status: "Active",
        createdAt: member.createdAt || now(),
      });
      changed = true;
    }
  }
  if (changed) writeDb(db);
  return db;
}

function writeDb(db) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, `${JSON.stringify(db, null, 2)}\n`);
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(10).toString("hex")}`;
}

function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

function makeSaccoRegistration() {
  return `ZS-SACCO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;
}

function isStrongPassword(password) {
  return String(password).length >= 12
    && !/\s/.test(password)
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

function hasSupabase() {
  const backend = String(process.env.DATA_BACKEND || "auto").toLowerCase();
  return backend !== "local" && Boolean(SUPABASE_URL && SUPABASE_KEY);
}

async function supabaseRpc(name, payload) {
  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ payload }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || `Supabase RPC ${name} failed.`);
  }
  return data;
}

function cleanAmount(value) {
  const number = Number(String(value || "0").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function loanRateForProduct(product) {
  const rates = {
    "business expansion": 14,
    agriculture: 12,
    education: 10,
    emergency: 12,
  };
  return rates[String(product || "").trim().toLowerCase()] || 14;
}

function addMonthsIso(value, months = 1) {
  const date = value ? new Date(value) : new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

function authPayload(input) {
  return { ...input, token: input.token || input.authToken || "" };
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  if (req.body !== undefined) {
    if (Buffer.isBuffer(req.body)) {
      try {
        return Promise.resolve(req.body.length ? JSON.parse(req.body.toString("utf8")) : {});
      } catch {
        return Promise.reject(new Error("Invalid JSON."));
      }
    }
    if (typeof req.body === "string") {
      try {
        return Promise.resolve(req.body ? JSON.parse(req.body) : {});
      } catch {
        return Promise.reject(new Error("Invalid JSON."));
      }
    }
    if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  }

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });
  });
}

function publicUser(user, role) {
  return {
    id: user.id,
    role,
    name: user.name,
    email: user.email,
    phone: user.phone,
    memberNumber: user.memberNumber,
    saccoId: user.saccoId,
  };
}

function createSession(db, role, user, rememberDevice) {
  const session = {
    id: makeId("session"),
    token: makeToken(),
    role,
    userId: user.id,
    saccoId: user.saccoId,
    rememberDevice: Boolean(rememberDevice),
    createdAt: now(),
  };
  db.sessions.push(session);
  return session;
}

function queueEmail(db, to, subject, body) {
  const email = {
    id: makeId("email"),
    to,
    subject,
    body,
    status: "queued",
    createdAt: now(),
  };
  db.outbox.push(email);
  return email;
}

function localAppData(db, session) {
  const isAdmin = session.role === "admin";
  const scopedMembers = db.members.filter((member) => member.saccoId === session.saccoId && (isAdmin || member.id === session.userId));
  const memberIds = new Set(scopedMembers.map((member) => member.id));
  const scopedAccounts = db.accounts.filter((account) => account.saccoId === session.saccoId && memberIds.has(account.memberId));
  const accountIds = new Set(scopedAccounts.map((account) => account.id));
  const scopedTransactions = db.transactions.filter((transaction) => transaction.saccoId === session.saccoId && accountIds.has(transaction.accountId));
  const scopedLoans = db.loans.filter((loan) => loan.saccoId === session.saccoId && memberIds.has(loan.memberId));
  const totalSavings = scopedAccounts.reduce((sum, account) => sum + cleanAmount(account.balance), 0);
  return {
    sacco: db.saccos.find((item) => item.id === session.saccoId) || { name: "Z-SACCO Demo Cooperative", registrationNumber: "ZS-SACCO-2026-100001" },
    summary: {
      totalMembers: scopedMembers.length,
      totalAccounts: scopedAccounts.length,
      totalSavings,
      activeLoans: scopedLoans.filter((loan) => !["Rejected", "Closed"].includes(loan.status)).length,
      totalTransactions: scopedTransactions.length,
    },
    members: scopedMembers.map((member) => ({
      id: member.id,
      memberNumber: member.memberNumber,
      name: member.name,
      phone: member.phone,
      email: member.email,
      branch: member.branch || "Main Branch",
      profilePhoto: member.profilePhoto || "",
      documents: member.documents || [],
      savingsBalance: scopedAccounts.filter((account) => account.memberId === member.id).reduce((sum, account) => sum + cleanAmount(account.balance), 0),
      loansCount: scopedLoans.filter((loan) => loan.memberId === member.id).length,
      status: "Active",
      createdAt: member.createdAt,
    })),
    accounts: scopedAccounts.map((account) => ({
      ...account,
      memberName: scopedMembers.find((member) => member.id === account.memberId)?.name || "Member",
    })),
    transactions: scopedTransactions.sort((a, b) => String(b.date).localeCompare(String(a.date))),
    loans: scopedLoans.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
    staff: isAdmin ? db.admins.filter((admin) => admin.saccoId === session.saccoId).map((admin) => ({ ...publicUser(admin, "admin"), role: "Admin", branch: "Head Office", access: "Full access", status: "Active" })) : [],
  };
}

function mergeLocalMemberDocuments(data) {
  const db = readDb();
  const documents = db.memberDocuments || [];
  const membersToMerge = data.members || [];
  membersToMerge.forEach((member) => {
    const memberDocs = documents.filter((doc) => doc.memberId === member.id || doc.memberNumber === member.memberNumber);
    if (!memberDocs.length) return;
    member.documents = memberDocs;
    member.profilePhoto = memberDocs.find((doc) => doc.isProfilePhoto)?.dataUrl || member.profilePhoto || "";
  });
  return data;
}

function storeMemberDocuments(member, docs = []) {
  if (!member || !Array.isArray(docs) || !docs.length) return;
  const db = readDb();
  db.memberDocuments ||= [];
  const normalizedDocs = docs.map((doc) => ({
    id: makeId("doc"),
    memberId: member.id,
    memberNumber: member.memberNumber,
    documentType: doc.documentType || "KYC Document",
    fileName: doc.fileName || "document",
    mimeType: doc.mimeType || "application/octet-stream",
    dataUrl: doc.dataUrl,
    isProfilePhoto: Boolean(doc.isProfilePhoto),
    uploadedAt: now(),
  })).filter((doc) => doc.dataUrl);
  if (!normalizedDocs.length) return;
  if (normalizedDocs.some((doc) => doc.isProfilePhoto)) {
    db.memberDocuments = db.memberDocuments.filter((doc) => doc.memberId !== member.id || !doc.isProfilePhoto);
  }
  db.memberDocuments.push(...normalizedDocs);
  writeDb(db);
}

async function registerSacco(req, res) {
  const input = await readBody(req);
  const required = ["saccoName", "saccoPhone", "saccoEmail", "ownerName", "ownerPhone", "ownerEmail", "password", "confirmPassword"];
  const missing = required.filter((key) => !String(input[key] || "").trim());
  if (missing.length) return sendJson(res, 400, { error: `Missing fields: ${missing.join(", ")}` });
  if (input.password !== input.confirmPassword) return sendJson(res, 400, { error: "Passwords do not match." });
  if (!isStrongPassword(input.password)) return sendJson(res, 400, { error: "Password must include uppercase, lowercase, number, and symbol." });

  if (hasSupabase()) {
    const result = await supabaseRpc("api_register_sacco", {
      saccoName: input.saccoName,
      saccoPhone: input.saccoPhone,
      saccoEmail: input.saccoEmail,
      location: input.location,
      memberCount: input.memberCount,
      ownerName: input.ownerName,
      ownerPhone: input.ownerPhone,
      ownerEmail: input.ownerEmail,
      passwordHash: hashPassword(input.password),
    });
    return sendJson(res, 201, result);
  }

  const db = readDb();
  const emailTaken = db.admins.some((admin) => admin.email.toLowerCase() === input.ownerEmail.toLowerCase());
  if (emailTaken) return sendJson(res, 409, { error: "Owner email is already registered." });

  const sacco = {
    id: makeId("sacco"),
    registrationNumber: makeSaccoRegistration(),
    name: input.saccoName.trim(),
    phone: input.saccoPhone.trim(),
    email: input.saccoEmail.trim(),
    location: String(input.location || "").trim(),
    memberCount: String(input.memberCount || "").trim(),
    status: "pending_activation",
    createdAt: now(),
  };
  const admin = {
    id: makeId("admin"),
    saccoId: sacco.id,
    name: input.ownerName.trim(),
    email: input.ownerEmail.trim(),
    phone: input.ownerPhone.trim(),
    passwordHash: hashPassword(input.password),
    createdAt: now(),
  };
  const member = {
    id: makeId("member"),
    saccoId: sacco.id,
    memberNumber: `ZS-${1000 + db.members.length + 1}`,
    name: input.ownerName.trim(),
    phone: input.ownerPhone.trim(),
    passwordHash: hashPassword(input.password),
    createdAt: now(),
  };
  admin.linkedMemberId = member.id;

  db.saccos.push(sacco);
  db.admins.push(admin);
  db.members.push(member);

  const email = queueEmail(
    db,
    admin.email,
    `Z-SACCO registration ${sacco.registrationNumber}`,
    [
      "Z-SACCO Account Details",
      "",
      `SACCO Name: ${sacco.name}`,
      `Registration Number: ${sacco.registrationNumber}`,
      `SACCO Phone: ${sacco.phone}`,
      `SACCO Email: ${sacco.email}`,
      `Location: ${sacco.location || "Not provided"}`,
      `Members: ${sacco.memberCount || "Not provided"}`,
      "",
      `Owner/Admin: ${admin.name}`,
      `Owner Email: ${admin.email}`,
      `Owner Phone: ${admin.phone}`,
      "",
      "This is the main SACCO admin account. The owner is also added as a member with limited member-portal access.",
    ].join("\n")
  );

  writeDb(db);
  sendJson(res, 201, {
    message: "SACCO account created. Email has been queued.",
    sacco,
    admin: publicUser(admin, "admin"),
    member: publicUser(member, "member"),
    email,
  });
}

async function login(req, res) {
  const input = await readBody(req);
  if (hasSupabase()) {
    const result = await supabaseRpc("api_login", {
      role: input.role,
      email: input.email,
      identity: input.identity,
      passwordHash: hashPassword(input.password || ""),
      rememberDevice: Boolean(input.rememberDevice),
    });
    return sendJson(res, 200, result);
  }

  const db = readDb();
  const role = String(input.role || "").toLowerCase();
  const passwordHash = hashPassword(input.password || "");

  if (role === "admin") {
    const admin = db.admins.find((item) => item.email.toLowerCase() === String(input.email || "").toLowerCase());
    if (!admin || !safeEqual(admin.passwordHash, passwordHash)) return sendJson(res, 401, { error: "Invalid admin login details." });
    const session = createSession(db, "admin", admin, input.rememberDevice);
    writeDb(db);
    return sendJson(res, 200, { message: "Logged in.", token: session.token, user: publicUser(admin, "admin") });
  }

  if (role === "member") {
    const identity = String(input.identity || "").trim().toLowerCase();
    const member = db.members.find((item) => {
      const sacco = db.saccos.find((entry) => entry.id === item.saccoId);
      return [item.name, item.memberNumber, sacco?.registrationNumber].filter(Boolean).some((value) => value.toLowerCase() === identity);
    });
    if (!member || !safeEqual(member.passwordHash, passwordHash)) return sendJson(res, 401, { error: "Invalid member login details." });
    const session = createSession(db, "member", member, input.rememberDevice);
    writeDb(db);
    return sendJson(res, 200, { message: "Logged in.", token: session.token, user: publicUser(member, "member") });
  }

  sendJson(res, 400, { error: "Role must be admin or member." });
}

async function forgotPassword(req, res) {
  const input = await readBody(req);
  if (hasSupabase()) {
    const result = await supabaseRpc("api_forgot_password", {
      role: input.role,
      identity: input.identity,
    });
    return sendJson(res, 200, result);
  }

  const db = readDb();
  const role = String(input.role || "").toLowerCase();
  const identity = String(input.identity || "").trim().toLowerCase();
  const resetCode = `RESET-${Math.floor(100000 + Math.random() * 899999)}`;
  let to = "";

  if (role === "admin") {
    const admin = db.admins.find((item) => item.email.toLowerCase() === identity);
    to = admin?.email || input.identity;
  } else {
    const member = db.members.find((item) => [item.name, item.memberNumber].some((value) => value.toLowerCase() === identity));
    to = member?.phone || input.identity;
  }

  db.passwordResets.push({ id: makeId("reset"), role, identity: input.identity, resetCode, createdAt: now() });
  const email = queueEmail(db, to, "Z-SACCO password reset", `Use this reset code to reset your ${role} password: ${resetCode}`);
  writeDb(db);
  sendJson(res, 200, { message: "Password reset instructions queued.", resetCode, email });
}

async function logout(req, res) {
  const input = await readBody(req);
  if (hasSupabase()) {
    const result = await supabaseRpc("api_logout", { token: input.token });
    return sendJson(res, 200, result);
  }

  const db = readDb();
  db.sessions = db.sessions.filter((session) => session.token !== input.token);
  writeDb(db);
  sendJson(res, 200, { message: "Logged out." });
}

async function submitInquiry(req, res) {
  const input = await readBody(req);
  const inquiry = {
    saccoName: String(input.saccoName || "").trim(),
    email: String(input.email || "").trim().toLowerCase(),
    phone: String(input.phone || "").trim(),
    message: String(input.message || "").trim(),
  };

  if (inquiry.saccoName.length < 2 || inquiry.saccoName.length > 120) {
    return sendJson(res, 400, { error: "Enter a valid SACCO name." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) || inquiry.email.length > 254) {
    return sendJson(res, 400, { error: "Enter a valid email address." });
  }
  if (inquiry.phone.length < 7 || inquiry.phone.length > 30) {
    return sendJson(res, 400, { error: "Enter a valid phone number." });
  }
  if (inquiry.message.length < 10 || inquiry.message.length > 2000) {
    return sendJson(res, 400, { error: "Your message must be between 10 and 2,000 characters." });
  }

  if (hasSupabase()) {
    const result = await supabaseRpc("api_submit_inquiry", inquiry);
    return sendJson(res, 201, result);
  }

  const db = readDb();
  const record = {
    id: makeId("inquiry"),
    ...inquiry,
    status: "new",
    createdAt: now(),
  };
  db.inquiries.push(record);
  writeDb(db);
  return sendJson(res, 201, { message: "Your inquiry has been received.", inquiryId: record.id });
}

async function appData(req, res) {
  const input = await readBody(req);
  if (hasSupabase()) {
    const result = await supabaseRpc("api_get_app_data", authPayload(input));
    return sendJson(res, 200, result);
  }

  const db = readDb();
  const session = db.sessions.find((item) => item.token === input.token);
  if (!session) return sendJson(res, 401, { error: "Invalid or expired session." });
  return sendJson(res, 200, localAppData(db, session));
}

async function saveMember(req, res) {
  const input = await readBody(req);
  const isEdit = Boolean(String(input.memberId || "").trim());
  if (!String(input.name || "").trim()) return sendJson(res, 400, { error: "Member name is required." });
  if (!String(input.email || "").trim()) return sendJson(res, 400, { error: "Member email is required." });
  if (!String(input.phone || "").trim()) return sendJson(res, 400, { error: "Member phone is required." });
  if ((!isEdit || input.password) && !isStrongPassword(input.password || "")) return sendJson(res, 400, { error: "Member password must be at least 12 characters with uppercase, lowercase, number, symbol, and no spaces." });

  if (hasSupabase()) {
    const result = await supabaseRpc("api_save_member", authPayload({
      ...input,
      passwordHash: input.password ? hashPassword(input.password) : "",
      temporaryPassword: input.temporaryPassword || input.password,
    }));
    return sendJson(res, 200, result);
  }

  const db = readDb();
  const session = db.sessions.find((item) => item.token === input.token && item.role === "admin");
  if (!session) return sendJson(res, 401, { error: "Only admins can manage members." });
  if (isEdit) {
    const member = db.members.find((item) => item.id === input.memberId && item.saccoId === session.saccoId);
    if (!member) return sendJson(res, 404, { error: "Member not found." });
    Object.assign(member, {
      name: input.name.trim(),
      phone: input.phone,
      email: input.email,
      branch: input.branch || "Main Branch",
      nationalId: input.nationalId || "",
      memberType: input.memberType || "Individual",
      address: input.address || "",
      documents: input.kycDocuments?.length ? input.kycDocuments : member.documents,
      profilePhoto: input.kycDocuments?.find((doc) => doc.isProfilePhoto)?.dataUrl || member.profilePhoto,
      ...(input.password ? { passwordHash: hashPassword(input.password) } : {}),
    });
    writeDb(db);
    return sendJson(res, 200, localAppData(db, session));
  }
  const member = {
    id: makeId("member"),
    saccoId: session.saccoId,
    memberNumber: `ZS-${1000 + db.members.length + 1}`,
    name: input.name.trim(),
    phone: input.phone || "",
    email: input.email || "",
    branch: input.branch || "Main Branch",
    nationalId: input.nationalId || "",
    memberType: input.memberType || "Individual",
    address: input.address || "",
    profilePhoto: (input.kycDocuments || []).find((doc) => doc.isProfilePhoto)?.dataUrl || "",
    documents: input.kycDocuments || [],
    passwordHash: hashPassword(input.password || "Member2026!"),
    createdAt: now(),
  };
  db.members.push(member);
  db.accounts.push({
    id: makeId("account"),
    saccoId: session.saccoId,
    memberId: member.id,
    accountNumber: `SAV-${member.memberNumber}`,
    accountType: "Savings",
    balance: 0,
    status: "Active",
    createdAt: now(),
  });
  queueEmail(
    db,
    member.email,
    "Your Z-SACCO member login details",
    [
      "Welcome to Z-SACCO",
      "",
      "Your member portal has been created.",
      `Member Number: ${member.memberNumber}`,
      `Login Identity: ${member.memberNumber}`,
      `Temporary Password: ${input.temporaryPassword || input.password}`,
      "",
      "Please sign in and change your password after first login.",
    ].join("\n")
  );
  queueEmail(
    db,
    member.phone,
    "Z-SACCO member SMS login details",
    `Z-SACCO login: Member ${member.memberNumber}, Password ${input.temporaryPassword || input.password}. Change after first login.`
  );
  writeDb(db);
  return sendJson(res, 200, localAppData(db, session));
}

async function postTransaction(req, res) {
  const input = await readBody(req);
  if (hasSupabase()) {
    const result = await supabaseRpc("api_post_transaction", authPayload({
      ...input,
      amount: cleanAmount(input.amount),
    }));
    return sendJson(res, 200, result);
  }
  const db = readDb();
  const session = db.sessions.find((item) => item.token === input.token && item.role === "admin");
  if (!session) return sendJson(res, 401, { error: "Only admins can post transactions." });
  const account = db.accounts.find((item) => item.id === input.accountId && item.saccoId === session.saccoId);
  if (!account) return sendJson(res, 404, { error: "Account not found." });
  const amount = cleanAmount(input.amount);
  if (amount <= 0) return sendJson(res, 400, { error: "Amount must be greater than zero." });
  const type = String(input.transactionType || "").toLowerCase();
  const allowedTypes = ["deposit", "savings deposit", "share contribution", "loan repayment", "withdrawal"];
  if (!allowedTypes.includes(type)) return sendJson(res, 400, { error: "Select a valid transaction type." });
  if (!String(input.method || "").trim()) return sendJson(res, 400, { error: "Select a payment method." });
  if (type === "withdrawal" && amount > cleanAmount(account.balance)) return sendJson(res, 400, { error: "Insufficient account balance." });
  if (["deposit", "savings deposit", "share contribution"].includes(type)) {
    account.balance = cleanAmount(account.balance) + amount;
  } else if (type === "withdrawal") {
    account.balance = cleanAmount(account.balance) - amount;
  }
  const member = db.members.find((item) => item.id === account.memberId);
  if (type === "loan repayment") {
    const loan = db.loans.find((item) => item.id === input.loanId && item.memberId === account.memberId && item.saccoId === session.saccoId);
    if (!loan || ["rejected", "closed"].includes(String(loan.status || "").toLowerCase())) {
      return sendJson(res, 400, { error: "Select an active loan belonging to this member." });
    }
    const principal = cleanAmount(loan.approvedAmount || loan.requestedAmount);
    const outstanding = Math.max(0, principal - cleanAmount(loan.repaidAmount));
    if (amount > outstanding) return sendJson(res, 400, { error: `Payment exceeds the outstanding loan balance of ${outstanding}.` });
    loan.repaidAmount = cleanAmount(loan.repaidAmount) + amount;
    loan.progressPercent = principal > 0 ? Math.min(100, Math.round((loan.repaidAmount / principal) * 100)) : 0;
    if (loan.repaidAmount >= principal) {
      loan.status = "Closed";
      loan.nextDue = null;
    } else {
      loan.nextDue = addMonthsIso(loan.nextDue, 1);
    }
  }
  const transactionLabels = {
    deposit: "Deposit",
    "savings deposit": "Savings deposit",
    "share contribution": "Share contribution",
    "loan repayment": "Loan repayment",
    withdrawal: "Withdrawal",
  };
  db.transactions.push({
    id: makeId("transaction"), reference: makeId("TX").slice(0, 14).toUpperCase(),
    saccoId: session.saccoId, accountId: account.id, memberId: member?.id,
    memberName: member?.name || "Member", transactionType: transactionLabels[type],
    amount, method: input.method, narration: input.narration || "", status: "Completed", date: now(),
  });
  writeDb(db);
  return sendJson(res, 200, localAppData(db, session));
}

async function submitLoan(req, res) {
  const input = await readBody(req);
  if (hasSupabase()) {
    const result = await supabaseRpc("api_submit_loan", authPayload({
      ...input,
      amount: cleanAmount(input.amount),
    }));
    return sendJson(res, 200, result);
  }
  const db = readDb();
  const session = db.sessions.find((item) => item.token === input.token && item.role === "admin");
  if (!session) return sendJson(res, 401, { error: "Only admins can submit loans from this screen." });
  const member = db.members.find((item) => item.id === input.memberId && item.saccoId === session.saccoId);
  if (!member) return sendJson(res, 404, { error: "Member not found." });
  const amount = cleanAmount(input.amount);
  if (amount <= 0) return sendJson(res, 400, { error: "Loan amount must be greater than zero." });
  const termMonths = Number(input.term);
  if (!Number.isInteger(termMonths) || termMonths < 1 || termMonths > 60) return sendJson(res, 400, { error: "Select a valid repayment term." });
  if (!String(input.product || "").trim() || !String(input.purpose || "").trim()) return sendJson(res, 400, { error: "Loan product and purpose are required." });
  db.loans.push({
    id: makeId("loan"), loanNumber: makeId("LN").slice(0, 14).toUpperCase(), saccoId: session.saccoId,
    memberId: member.id, memberName: member.name, product: input.product || "Standard Loan",
    requestedAmount: amount, approvedAmount: 0, repaidAmount: 0, termMonths,
    annualRate: loanRateForProduct(input.product), installmentAmount: 0, nextDue: null,
    purpose: input.purpose, progressPercent: 0, status: "Pending", createdAt: now(),
  });
  writeDb(db);
  return sendJson(res, 200, localAppData(db, session));
}

async function decideLoan(req, res) {
  const input = await readBody(req);
  if (hasSupabase()) {
    const result = await supabaseRpc("api_decide_loan", authPayload(input));
    return sendJson(res, 200, result);
  }
  const db = readDb();
  const session = db.sessions.find((item) => item.token === input.token && item.role === "admin");
  if (!session) return sendJson(res, 401, { error: "Only admins can decide loans." });
  const loan = db.loans.find((item) => item.id === input.loanId && item.saccoId === session.saccoId);
  if (!loan) return sendJson(res, 404, { error: "Loan not found." });
  const decision = String(input.decision || "").toLowerCase();
  if (!['approve', 'reject'].includes(decision)) return sendJson(res, 400, { error: "Decision must be approve or reject." });
  if (loan.status !== "Pending") return sendJson(res, 409, { error: "Only pending loan applications can be decided." });
  loan.status = decision === "approve" ? "Performing" : "Rejected";
  loan.approvedAmount = decision === "approve" ? loan.requestedAmount : 0;
  loan.repaidAmount = 0;
  loan.progressPercent = 0;
  loan.annualRate = loanRateForProduct(loan.product);
  loan.installmentAmount = decision === "approve" ? Math.ceil(loan.requestedAmount / Math.max(1, loan.termMonths)) : 0;
  loan.nextDue = decision === "approve" ? addMonthsIso(null, 1) : null;
  loan.decidedAt = now();
  writeDb(db);
  return sendJson(res, 200, localAppData(db, session));
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let requestPath = decodeURIComponent(url.pathname);
  if (requestPath === "/") requestPath = "/index.html";
  if (!PUBLIC_FILES.has(requestPath) && !requestPath.startsWith("/assets/")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const filePath = path.join(ROOT, requestPath.replace(/^\//, ""));
  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

async function requestHandler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "POST" && url.pathname === "/api/saccos") return registerSacco(req, res);
    if (req.method === "POST" && url.pathname === "/api/auth/login") return login(req, res);
    if (req.method === "POST" && url.pathname === "/api/auth/forgot-password") return forgotPassword(req, res);
    if (req.method === "POST" && url.pathname === "/api/auth/logout") return logout(req, res);
    if (req.method === "POST" && url.pathname === "/api/inquiries") return submitInquiry(req, res);
    if (req.method === "POST" && url.pathname === "/api/app-data") return appData(req, res);
    if (req.method === "POST" && url.pathname === "/api/members") return saveMember(req, res);
    if (req.method === "POST" && url.pathname === "/api/transactions") return postTransaction(req, res);
    if (req.method === "POST" && url.pathname === "/api/loans") return submitLoan(req, res);
    if (req.method === "POST" && url.pathname === "/api/loans/decision") return decideLoan(req, res);
    if (req.method === "GET" && url.pathname === "/api/health") return sendJson(res, 200, { ok: true, time: now() });
    if (req.method === "GET") return serveStatic(req, res);
    sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error." });
  }
}

module.exports = requestHandler;

if (require.main === module) {
  if (!hasSupabase()) ensureDb();
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`Z-SACCO server running at http://localhost:${PORT}`);
  });
}
