import { saveUnit, updateUnit } from '@/actions/UnitManagement';
import { isValidAdminSession } from '@/security/Security';
import { addUnit, unitWithIdAlreadyExists } from '@/app/service/learning/units/unitService';
import { db } from '@/persistency/Db';
import { handleError, handleSuccess } from '@/actions/globals/Generics';

jest.mock('@/security/Security', () => ({
    isValidAdminSession: jest.fn()
}));

jest.mock('@/app/service/learning/units/unitService', () => ({
    addUnit: jest.fn(),
    unitWithIdAlreadyExists: jest.fn()
}));

jest.mock('@/persistency/Db', () => ({
    db: {
        unit: {
            update: jest.fn()
        }
    }
}));

jest.mock('@/actions/globals/Generics', () => ({
    handleError: jest.fn((msg) => ({ error: msg })),
    handleSuccess: jest.fn((msg) => ({ success: msg }))
}));

describe('UnitManagement Server Actions unit tests', () => {
    const validInput = {
        name: 'Unit 1',
        description: 'Introduction'
    };
    const courseId = 'course-123';
    const unitId = 'unit-456';

    beforeEach(() => {
        jest.clearAllMocks();
        (isValidAdminSession as jest.Mock).mockResolvedValue(true);
        (unitWithIdAlreadyExists as jest.Mock).mockResolvedValue(true);
    });

    describe('saveUnit', () => {
        it('Should return error if courseId is missing', async () => {
            const result = await saveUnit(validInput, '');
            expect(result).toEqual({ error: 'The course ID cannot be empty!' });
        });

        it('Should return success if unit is added', async () => {
            (addUnit as jest.Mock).mockResolvedValue({ id: 'unit-123' });

            const result = await saveUnit(validInput, courseId);
            expect(addUnit).toHaveBeenCalledWith(validInput, courseId);
            expect(handleSuccess).toHaveBeenCalledWith('Unit created successfully!');
            expect(result).toEqual({ success: 'Unit created successfully!' });
        });

        it('Should return error if addUnit fails', async () => {
            (addUnit as jest.Mock).mockResolvedValue(null);

            const result = await saveUnit(validInput, courseId);
            expect(handleError).toHaveBeenCalledWith(expect.stringContaining('create the unit'));
            expect(result).toEqual(expect.objectContaining({ error: expect.any(String) }));
        });
    });

    describe('updateUnit', () => {
        it('Should return error if unit ID is missing', async () => {
            const result = await updateUnit(validInput, '');
            expect(result).toEqual({ error: 'The unit ID cannot be empty!' });
        });

        it('Should return error if unitWithIdAlreadyExists returns false', async () => {
            (unitWithIdAlreadyExists as jest.Mock).mockResolvedValue(false);

            const result = await updateUnit(validInput, unitId);
            expect(result).toEqual({ error: 'An unexpected error occurred while attempting to create the course. Please try again later.' });
        });

        it('Should return success if update is successful', async () => {
            (db.unit.update as jest.Mock).mockResolvedValue({ id: unitId });

            const result = await updateUnit(validInput, unitId);
            expect(db.unit.update).toHaveBeenCalledWith({
                where: { id: unitId },
                data: validInput
            });
            expect(result).toEqual({ success: 'Course updated successfully!' });
        });

        it('Should throw if update fails', async () => {
            (db.unit.update as jest.Mock).mockRejectedValue(new Error('fail'));

            await expect(updateUnit(validInput, unitId)).rejects.toThrow('create the course');
        });
    });
});