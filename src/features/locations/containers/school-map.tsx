import { Card, CardContent, CardHeader, Input, lang } from "@/core/libs";
import { Regions } from "@/core/models";
import { provinceModel } from "@/core/models/province";
import { useBiodata } from "@/features/user";
import { Feature } from 'geojson';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { RegionDropdown } from '../components/school-region-dropdown';
import { useProvinces, useSchool } from '../hooks';
import { regionConfig } from '../utils/region-config';

// Configure Leaflet marker icon
const DefaultIcon = L.icon({
  iconUrl: '/other.png',
  shadowUrl: markerShadow,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Define MapEventsHandler component
const MapEventsHandler = () => {
  useMapEvent("moveend", (event) => {
    const map = event.target;
    const center = map.getCenter();
    // Optionally log or use the center coordinates
    // console.log("Map center:", center);
  });
  return null;
};

export const SchoolMap = () => {
  const [center] = useState<[number, number]>([-6.16667, 106.82676]);
  const [zoom] = useState<number>(12);
  const [activeLineMarker] = useState<boolean>(false); // Disabled for now
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [regions, setRegions] = useState<Regions>({
    central: true,
    south: false,
    north: false,
    west: false,
    east: false,
  });

  const { data: students } = useBiodata();
  const schools = useSchool();
  const provinces = useProvinces();

  console.log('sttt', students);

  // Create studentData from useBiodata, filtering out null locations
  // const studentData = useMemo(() => {
  //   return (
  //     students
  //       ?.filter((student) => student.location !== null) // Filter out null locations
  //       .map((student) => ({
  //         lat: student.location.latitude,
  //         lng: student.location.longitude,
  //         name: student.user.name,
  //         email: student.user.email,
  //         alamat: student.user.alamat || "Alamat belum ditentukan",
  //         updatedAt: student.location.updatedAt, // Add updatedAt from location
  //       })) || []
  //   );
  // }, [students]);

  const studentData = useMemo(() => {
    return (
      (Array.isArray(students?.data) ? students.data : [])
        .filter((student) => student.location !== null)
        .map((student) => ({
          lat: student.location.latitude,
          lng: student.location.longitude,
          name: student.user.name,
          email: student.user.email,
          alamat: student.user.alamat || "Alamat belum ditentukan",
          updatedAt: student.location.updatedAt,
        }))
    );
  }, [students]);

  const toggleRegion = (region: keyof Regions) => {
    setRegions((prev) => ({
      ...prev,
      [region]: !prev[region],
    }));
  };

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    if (feature?.properties && (feature?.properties?.NAMOBJ || feature?.properties?.namobj)) {
      layer.bindTooltip(feature?.properties?.NAMOBJ ?? feature?.properties?.namobj);
    }
  };

  // Keep school count by province for the left panel
  const schoolCountByProvince = schools?.data
    ? schools.data.reduce((acc: { [key: number]: number }, school) => {
      const provinceIds = school?.provinceId;
      if (provinceIds !== undefined && provinceIds !== null) {
        acc[provinceIds] = (acc[provinceIds] || 0) + 1;
      }
      return acc;
    }, {})
    : {};

  const result = provinces.data
    ? provinces.data
      ?.filter((province: provinceModel) => schoolCountByProvince[province.id] > 0)
      ?.map((province: provinceModel) => ({
        name: province.name,
        count: schoolCountByProvince[province.id],
      }))
    : [];

  const handleExportPercentage = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Laporan Sebaran Sekolah (Provinsi)', 14, 20);

    const totalCount = result.reduce((sum, item) => sum + item.count, 0);
    const tableData = result
      .sort((a, b) => b.count - a.count)
      .map((data, index) => {
        const percentage = totalCount > 0 ? (data.count / totalCount) * 100 : 0;
        return [
          (index + 1).toString(),
          data.name,
          data.count.toString(),
          `${percentage.toFixed(2)}%`,
        ];
      });

    autoTable(doc, {
      head: [['No', 'Nama Provinsi', 'Jumlah Sekolah', 'Persentase']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
      },
    });

    doc.save('sebaran_sekolah_per_provinsi.pdf');
  };

  if (!students || !schools?.data) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">{lang.text('loading')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="z-[1] w-full mb-12 mt-4 bg-theme-color-primary/5">
      <CardContent className="p-0">
        <div className="relative w-full gap-4 h-max">
          {/* Left - Stats and Progress */}
          <Card className="absolute z-[9999] w-max h-[40px] flex items-center p-6 top-6 left-6">
            <div className="w-full flex items-center space-y-0">
              <div className="w-max flex mr-4 border-r border-white/50 pr-4 items-center">
                <h3 className="text-lg w-max font-normal">{lang.text('studentTotal')}</h3>
                <div className="flex items-center gap-4">
                  <h2 className="text-lg ml-4 text-foreground">({students?.length || 0})</h2>
                  {/* <div
                    className="bg-[#0f4d3f] text-[#3ee07a] w-max flex items-center text-xs font-sans rounded px-2 py-1"
                  >
                    {'20.7%'} <FaArrowUp className="rotate-[30deg] ml-2" />
                  </div> */}
                </div>
              </div>
              <div className="w-max flex items-center">
                <h3 className="text-lg w-max font-normal">{lang.text('locationTotal')}</h3>
                <div className="flex items-center gap-4 w-[80px]">
                  <h2 className="text-lg text-foreground ml-4 w-max">({studentData?.length || 0})</h2>
                  <img src={'/other.png'} alt="icon" className="w-[28%]" />
                </div>
              </div>
            </div>
          </Card>

          {/* Right - Map */}
          <Card className="w-[100%] h-[72vh]">
            <CardContent className="p-0 h-full">
              <div className="relative rounded-lg h-full overflow-hidden">
                <div className="absolute right-4 top-4 z-[11] flex items-center gap-2">
                  <Input
                    placeholder={lang.text('searchLocation')}
                    value={searchLocation || ""}
                    onChange={(e) => setSearchLocation(String(e.target?.value))}
                    className="sm:max-w-[300px] flex-1"
                  />
                  {/* <Button
                    variant={activeLineMarker ? "default" : "outline"}
                    onClick={() => setActiveLineMarker(!activeLineMarker)}
                    className={`flex items-center justify-center w-[38px] h-[38px] ${
                      activeLineMarker ? 'bg-blue-500 text-white' : 'text-foreground'
                    }`}
                    title="line-marker"
                  >
                    <FaGripLines className="text-sm" />
                  </Button> */}
                  <RegionDropdown regions={regions} toggleRegion={toggleRegion} />
                </div>
                <MapContainer
                  className="w-full h-full"
                  center={center}
                  zoom={zoom}
                  scrollWheelZoom={true}
                  attributionControl={false}
                  zoomControl={false}
                  doubleClickZoom={true}
                  dragging={true}
                  easeLinearity={0.35}
                >
                  <MapEventsHandler />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution={'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'}
                  />
                  {studentData && studentData.length > 0
                    ? studentData
                      .filter((data) => {
                        if (searchLocation && searchLocation !== '') {
                          return data.name.toLowerCase().includes(searchLocation.toLowerCase());
                        }
                        return true;
                      })
                      .map((student, index) => (
                        <Marker
                          icon={DefaultIcon}
                          key={students[index]?.id || index}
                          position={[student.lat, student.lng]}
                        >
                          <Popup>
                            <strong>{student.name}</strong> <br />
                            {student.email} <br />
                            {student.alamat} <br />
                            <span>Last Updated: {new Date(student.updatedAt).toLocaleString()}</span>
                          </Popup>
                        </Marker>
                      ))
                    : null}
                  {regionConfig.map(
                    ({ key, data, style, active }: any) =>
                      active(regions) && (
                        <GeoJSON
                          key={key}
                          data={data}
                          style={style}
                          onEachFeature={onEachFeature}
                        />
                      ),
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};