const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { generateApiKey, generateAgentToken, generateSlug } = require('../utils/tokenGenerator');
const { generateQRCodeDataURL } = require('../utils/qrGenerator');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-auto-print-saas-2026';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BASE_SERVER_URL = process.env.BASE_SERVER_URL || 'http://localhost:5000';

async function registerCafe(req, res) {
  try {
    const { name, email, password, phone, bwPricePerPage, colorPricePerPage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const existingTenant = await prisma.tenant.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingTenant) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const slug = generateSlug(name);
    const apiKey = generateApiKey();
    const agentToken = generateAgentToken();

    const websiteUrl = `${FRONTEND_URL}/cafe/${slug}`;
    const qrCodeUrl = await generateQRCodeDataURL(websiteUrl);

    const tenant = await prisma.tenant.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        slug,
        apiKey,
        agentToken,
        bwPricePerPage: bwPricePerPage ? parseFloat(bwPricePerPage) : 2.0,
        colorPricePerPage: colorPricePerPage ? parseFloat(colorPricePerPage) : 10.0,
        customWebsiteUrl: websiteUrl,
        qrCodeUrl,
      },
    });

    const token = jwt.sign(
      { tenantId: tenant.id, slug: tenant.slug, role: 'TENANT' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Cyber Cafe registered successfully',
      token,
      credentials: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        email: tenant.email,
        websiteUrl,
        backendApiUrl: `${BASE_SERVER_URL}/api/v1`,
        apiKey: tenant.apiKey,
        agentToken: tenant.agentToken,
        qrCodeUrl,
        bwPricePerPage: tenant.bwPricePerPage,
        colorPricePerPage: tenant.colorPricePerPage,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, error: 'Registration failed', details: error.message });
  }
}

async function loginCafe(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!tenant) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, tenant.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (tenant.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, error: 'Your Cyber Cafe account has been disabled' });
    }

    const token = jwt.sign(
      { tenantId: tenant.id, slug: tenant.slug, role: 'TENANT' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const websiteUrl = `${FRONTEND_URL}/cafe/${tenant.slug}`;

    return res.json({
      success: true,
      token,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        email: tenant.email,
        phone: tenant.phone,
        websiteUrl,
        backendApiUrl: `${BASE_SERVER_URL}/api/v1`,
        apiKey: tenant.apiKey,
        agentToken: tenant.agentToken,
        qrCodeUrl: tenant.qrCodeUrl,
        bwPricePerPage: tenant.bwPricePerPage,
        colorPricePerPage: tenant.colorPricePerPage,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Login failed', details: error.message });
  }
}

async function getMe(req, res) {
  try {
    const tenant = req.tenant;
    const websiteUrl = `${FRONTEND_URL}/cafe/${tenant.slug}`;

    return res.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        email: tenant.email,
        phone: tenant.phone,
        websiteUrl,
        backendApiUrl: `${BASE_SERVER_URL}/api/v1`,
        apiKey: tenant.apiKey,
        agentToken: tenant.agentToken,
        qrCodeUrl: tenant.qrCodeUrl,
        bwPricePerPage: tenant.bwPricePerPage,
        colorPricePerPage: tenant.colorPricePerPage,
        status: tenant.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch user info' });
  }
}

module.exports = {
  registerCafe,
  loginCafe,
  getMe,
};
