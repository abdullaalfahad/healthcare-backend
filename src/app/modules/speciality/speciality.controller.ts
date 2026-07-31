import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { specialityService } from './speciality.service';

const createSpeciality = catchAsync(async (req, res) => {
  const payload = req.body;
  const speciality = await specialityService.createSpeciality(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Speciality created successfully',
    data: speciality,
  });
});

export const specialityController = {
  createSpeciality,
};
