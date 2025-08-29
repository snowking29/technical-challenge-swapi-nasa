import { handler } from '../src/handlers/getFusion';
import { Logger } from '../src/utils/Logger';

const mockGetFusionedData = jest.fn();

jest.mock('../src/services/FusionFacade', () => ({
  FusionFacade: jest.fn().mockImplementation(() => ({
    getFusionedData: mockGetFusionedData,
  })),
}));

jest.mock('../src/utils/Logger');

describe('handler getFusion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe retornar datos fusionados correctamente', async () => {
    const mockEvent: any = {
      queryStringParameters: { id: '1', name: 'Luke' },
    };

    const mockData = { personaje: 'Luke', cancion: 'Star Wars Theme' };
    mockGetFusionedData.mockResolvedValueOnce(mockData);

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockData);
    expect(mockGetFusionedData).toHaveBeenCalledWith('Luke');
    expect(Logger.info).toHaveBeenCalled();
  });

  it('Debe manejar errores correctamente', async () => {
    const mockEvent: any = {
      queryStringParameters: { id: '1', name: 'Luke' },
    };

    const errorMessage = 'Some error';
    mockGetFusionedData.mockRejectedValueOnce(new Error(errorMessage));

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: errorMessage });
    expect(Logger.error).toHaveBeenCalled();
  });
});
