import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 192,
  height: 192,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 108,
          background: '#0A0D14',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#CAFF33',
          fontWeight: 900,
          borderRadius: 36,
          border: '6px solid rgba(202, 255, 51, 0.4)',
        }}
      >
        K
      </div>
    ),
    {
      ...size,
    }
  );
}
