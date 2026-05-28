export const checkAttendance = (dataA, dataB) => {
  // Helper function to format date
  const formatDateTime = (isoString: string | undefined) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // Buat Set dari userId untuk pencarian O(1)
  console.log("dataB")
  console.log(JSON.stringify(dataB))
  const userIds = new Set(dataA.data.map(item => item.userId));

  // Buat peta untuk mencari createdAt berdasarkan userId
  const attendanceMap = new Map(dataA.data.map(item => [item.userId, item.createdAt]));

  // Proses setiap objek di dataB
  const result = dataB.map(item => {
    const biodata = item.biodataSiswa?.[0]; // Simpan referensi untuk efisiensi
    const kelas = biodata?.kelas;
    const isPresent = userIds.has(item.id);
    return {
      id: item.id,
      name: item.name,
      nis: item.nis,
      nisn: item.nisn,
      email: item.email,
      image: item.image,
      surveiApps: item.surveiApps,
      jamMasuk: isPresent ? formatDateTime(attendanceMap.get(item.id)) : 'N/A',
      idBiodataSiswa: biodata?.id || null,
      idKelas: kelas?.id || null,
      sekolahId: kelas?.sekolahId || null,
      namaKelas: kelas?.namaKelas || null,
      status: isPresent ? "Hadir" : "Belum hadir"
    };
  });

  return result;
};