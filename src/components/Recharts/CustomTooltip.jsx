const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    console.log(payload)
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 12px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
        <p style={{ margin: 0, color: data.fill }}>
          Value: {data.value}
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;