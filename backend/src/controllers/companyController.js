import Company from '../models/Company.js';

// Register a new company (requires portal admin authentication)
export const registerCompany = async (req, res) => {
  try {
    // Check if portal admin is authenticated
    if (!req.portalAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Portal admin authentication required to register companies'
      });
    }

    console.log('Portal admin authenticated:', req.portalAdmin.email);
    console.log('Request body:', req.body);

    const { name, location, description, website, email, phone } = req.body;

    // Check if company with this email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this email already exists'
      });
    }

    // Create company (admin code will be auto-generated)
    console.log('Creating company with data:', {
      name,
      location,
      description,
      website,
      email,
      phone,
      registeredBy: req.portalAdmin.portalAdminId
    });

    // Generate admin code manually if needed
    let adminCode = null;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!adminCode && attempts < maxAttempts) {
      const generatedCode = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
      const existingCompany = await Company.findOne({ adminCode: generatedCode });
      if (!existingCompany) {
        adminCode = generatedCode;
      }
      attempts++;
    }

    if (!adminCode) {
      throw new Error('Failed to generate unique admin code');
    }

    const company = await Company.create({
      name,
      location,
      description,
      website,
      email,
      phone,
      adminCode,
      registeredBy: req.portalAdmin.portalAdminId
    });

    console.log('Company created successfully:', company._id);

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: {
        company: {
          id: company._id,
          name: company.name,
          location: company.location,
          email: company.email,
          adminCode: company.adminCode
        }
      }
    });
  } catch (error) {
    console.error('Error registering company:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get company by admin code
export const getCompanyByAdminCode = async (req, res) => {
  try {
    const { adminCode } = req.params;

    const company = await Company.findOne({ 
      adminCode,
      isActive: true 
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found or inactive'
      });
    }

    res.json({
      success: true,
      data: {
        id: company._id,
        name: company.name,
        location: company.location,
        description: company.description,
        website: company.website,
        email: company.email,
        phone: company.phone
      }
    });
  } catch (error) {
    console.error('Error getting company by admin code:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all companies (for admin purposes)
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .select('name location email adminCode createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('Error getting all companies:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error getting company by ID:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const company = await Company.findByIdAndUpdate(id, update, { new: true });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 