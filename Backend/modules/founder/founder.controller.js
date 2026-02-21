import * as founderService from "./founder.services.js"

export const getDashboardData = async (req, res) => {
    try {
        const { adminDuration, expertDuration } = req.query;
        const data = await founderService.getDashboardData(adminDuration, expertDuration);
        res.status(200).json({
            success: true,
            data: data,
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}

export const getFounderProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await founderService.getFounderProfile(id);
        res.status(200).json({
            success: true,
            data: profile,
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}