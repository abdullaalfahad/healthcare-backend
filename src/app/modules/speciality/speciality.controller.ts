import { catchAsync } from '../../shared/catchAsync';
import { specialityService } from './speciality.service';

const createSpeciality = catchAsync(async (req, res) => {
  const payload = req.body;
  const speciality = await specialityService.createSpeciality(payload);
  res.status(201).json({
    success: true,
    message: 'Speciality created successfully',
    data: speciality,
  });
});

export const specialityController = {
  createSpeciality,
};
