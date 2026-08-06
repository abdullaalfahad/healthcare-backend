import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { specialityService } from './speciality.service';

const getAllSpecialities = catchAsync(async (req, res) => {
  const specialities = await specialityService.getAllSpecialities();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Specialities retrieved successfully',
    data: specialities,
  });
});

const createSpeciality = catchAsync(async (req, res) => {
  const payload = req.body;
  const speciality = await specialityService.createSpeciality(payload);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Speciality created successfully',
    data: speciality,
  });
});

const deleteSpecility = catchAsync(async (req, res) => {
  const { id } = req.params;
  const speciality = await specialityService.deleteSpecility(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Speciality deleted successfully',
    data: speciality,
  });
});

export const specialityController = {
  getAllSpecialities,
  createSpeciality,
  deleteSpecility,
};
