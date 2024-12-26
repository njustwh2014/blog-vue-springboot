import { describe, it, expect, beforeEach, vi } from 'vitest';
import { upload } from './upload';
import request from '@/request';

vi.mock('@/request', () => ({
  default: vi.fn(),
}));

describe('upload', () => {
  const mockFormData = new FormData();
  mockFormData.append('file', new Blob(['file content'], { type: 'text/plain' }), 'test.txt');

  beforeEach(() => {
    vi.mocked(request).mockReset();
  });

  it('should make a POST request to /upload with form data', async () => {
    const mockResponse = { data: 'success' };
    vi.mocked(request).mockResolvedValue(mockResponse);

    const result = await upload(mockFormData);

    expect(request).toHaveBeenCalledWith({
      headers: { 'Content-Type': 'multipart/form-data' },
      url: '/upload',
      method: 'post',
      data: mockFormData,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should handle request errors', async () => {
    const error = new Error('Network Error');
    vi.mocked(request).mockRejectedValue(error);

    await expect(upload(mockFormData)).rejects.toThrow('Network Error');
  });
});
