import { Request, Response } from 'express';
import OrganizationModel from '../models/organizationModel';

export const createOrganization:any = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    try {
        const organization = new OrganizationModel({ name, description, members: [] });
        await organization.save();
        res.status(201).json({ organization_id: organization._id });
    } catch (error) {
        if (error instanceof Error) {
            
            return res.status(500).json({ message: error.message });
        }
    }
};
export const readOrganization : any = async (req: Request, res: Response) => {
    const { organization_id } = req.params;

    try {
        const organization = await OrganizationModel.findById(organization_id);
        if (!organization) return res.status(404).json({ message: 'Organization not found' });

        res.json({
            organization_id: organization._id,
            name: organization.name,
            description: organization.description,
            organization_members: organization.members,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
export const readAllOrganizations : any = async (req: Request, res: Response) => {
    try {
        const organizations = await OrganizationModel.find();
        const orgData = organizations.map(org => ({
            organization_id: org._id,
            name: org.name,
            description: org.description,
            organization_members: org.members,
        }));
        res.json(orgData);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const updateOrganization :any= async (req: Request, res: Response) => {
    const { organization_id } = req.params;
    const { name, description } = req.body;

    try {
        const updatedOrg = await OrganizationModel.findByIdAndUpdate(
            organization_id,
            { name, description },
            { new: true }
        );

        if (!updatedOrg) return res.status(404).json({ message: 'Organization not found' });

        res.json(updatedOrg);
    } catch (error) {
        if (error instanceof Error) {
            
            return res.status(500).json({ message: error.message });
        }
    }
};
export const deleteOrganization :any = async (req: Request, res: Response) => {
    const { organization_id } = req.params;

    try {
        const deletedOrg = await OrganizationModel.findByIdAndDelete(organization_id);
        if (!deletedOrg) return res.status(404).json({ message: 'Organization not found' });

        res.json({ message: 'Organization deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            
            return res.status(500).json({ message: error.message });
        }
    }
};

export const inviteUserToOrganization :any= async (req: Request, res: Response) => {
    const { organization_id } = req.params;
    const { user_email } = req.body;   
    
    res.json({ message: `User ${user_email} invited to organization ${organization_id}` });
};
