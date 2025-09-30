import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Switch,
  DatePicker,
  TreeSelect,
} from "antd";
import { useEffect, useState, useRef } from "react";
import { getAllFilms } from "../../services/filmServices";
import { getAllCity } from "../../services/cityServices";
import { getAllCinema } from "../../services/cinemaServices";
import { getAllRooms } from "../../services/roomServices";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

function ShowTimeForm({
  onFinish,
  onCancel,
  initialValues,
  submitButtonText = "Cập nhật",
}) {
  const [form] = Form.useForm();
  const [films, setFilms] = useState([]);
  const [cities, setCities] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [supportedFormats, setSupportedFormats] = useState([]);
  const initialValuesSetRef = useRef(false);

  // Fetch data khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filmResult, cityResult, cinemaResult, roomResult] = await Promise.all([
          getAllFilms(),
          getAllCity(),
          getAllCinema(),
          getAllRooms(),
        ]);

        setFilms(filmResult.data || []);
        setCities(cityResult || []);
        setCinemas(cinemaResult || []);
        setRooms(roomResult.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);


  // Build cinema tree structure
  const buildCinemaTree = (cinemasList) => {
    const parentCinemas = cinemasList.filter(cinema => !cinema.parentId);
    const childCinemas = cinemasList.filter(cinema => cinema.parentId);

    const treeData = parentCinemas.map(parent => ({
      title: parent.name,
      value: parent._id,
      key: parent._id,
      children: childCinemas
        .filter(child => {
          const parentIdValue = typeof child.parentId === 'object' 
            ? child.parentId._id 
            : child.parentId;
          return parentIdValue === parent._id;
        })
        .map(child => ({
          title: `└─ ${child.name}`,
          value: child._id,
          key: child._id,
        }))
    }));

    return treeData;
  };

  // Filter cinemas by selected city
  useEffect(() => {
    if (!selectedCityId) {
      setFilteredCinemas([]);
      return;
    }

    const filtered = cinemas.filter(cinema => {
      return cinema.cityIds && cinema.cityIds.some(cityId => {
        const cityIdValue = typeof cityId === 'object' ? cityId._id : cityId;
        return cityIdValue === selectedCityId;
      });
    });

    const treeData = buildCinemaTree(filtered);
    setFilteredCinemas(treeData);
  }, [selectedCityId, cinemas]);

  // Filter rooms by selected cinema
  useEffect(() => {
    if (!selectedCinemaId) {
      setFilteredRooms([]);
      setSupportedFormats([]);
      return;
    }

    const filtered = rooms.filter(room => {
      const roomCinemaId = typeof room.cinemaId === 'object' 
        ? room.cinemaId._id 
        : room.cinemaId;
      return roomCinemaId === selectedCinemaId;
    });

    setFilteredRooms(filtered);
  }, [selectedCinemaId, rooms]);

  // Update supported formats when room is selected
  useEffect(() => {
    if (!selectedRoomId) {
      setSupportedFormats([]);
      return;
    }

    const selectedRoom = rooms.find(room => room._id === selectedRoomId);
    if (selectedRoom && selectedRoom.supportedFormats) {
      setSupportedFormats(selectedRoom.supportedFormats);
      
      // Reset format field nếu format hiện tại không được hỗ trợ
      const currentFormat = form.getFieldValue('format');
      if (currentFormat && !selectedRoom.supportedFormats.includes(currentFormat)) {
        form.setFieldValue('format', undefined);
      }
    }
  }, [selectedRoomId, rooms, form]);

  // Handle city change
  const handleCityChange = (value) => {
    setSelectedCityId(value);
    form.setFieldValue('cinemaId', undefined);
    form.setFieldValue('roomId', undefined);
    form.setFieldValue('format', undefined);
    setSelectedCinemaId(null);
    setSelectedRoomId(null);
  };

  // Handle cinema change
  const handleCinemaChange = (value) => {
    setSelectedCinemaId(value);
    form.setFieldValue('roomId', undefined);
    form.setFieldValue('format', undefined);
    setSelectedRoomId(null);
  };

  // Handle room change
  const handleRoomChange = (value) => {
    setSelectedRoomId(value);
    form.setFieldValue('format', undefined);
  };

  // Set initial values
  useEffect(() => {
    if (initialValues && !initialValuesSetRef.current) {
      // Process IDs
      const processedCinemaId = typeof initialValues.cinemaId === 'object'
        ? initialValues.cinemaId._id
        : initialValues.cinemaId;
      
      const processedRoomId = typeof initialValues.roomId === 'object'
        ? initialValues.roomId._id
        : initialValues.roomId;
      
      const processedFilmId = typeof initialValues.filmId === 'object'
        ? initialValues.filmId._id
        : initialValues.filmId;

      // Set city based on cinema
      if (processedCinemaId) {
        const cinema = cinemas.find(c => c._id === processedCinemaId);
        if (cinema && cinema.cityIds && cinema.cityIds.length > 0) {
          const firstCityId = typeof cinema.cityIds[0] === 'object'
            ? cinema.cityIds[0]._id
            : cinema.cityIds[0];
          setSelectedCityId(firstCityId);
        }
        setSelectedCinemaId(processedCinemaId);
      }

      if (processedRoomId) {
        setSelectedRoomId(processedRoomId);
      }

      // Process seatTypes to extract individual prices
      let basePriceValue = initialValues.basePrice || 0;
      let vipExtraFee = 0;
      let coupleExtraFee = 0;

      if (initialValues.seatTypes && Array.isArray(initialValues.seatTypes)) {
        const vipSeat = initialValues.seatTypes.find(st => st.type === 'vip');
        const coupleSeat = initialValues.seatTypes.find(st => st.type === 'couple');
        
        if (vipSeat) vipExtraFee = vipSeat.extraFee || 0;
        if (coupleSeat) coupleExtraFee = coupleSeat.extraFee || 0;
      }

      form.setFieldsValue({
        filmId: processedFilmId,
        cinemaId: processedCinemaId,
        roomId: processedRoomId,
        format: initialValues.format,
        basePrice: basePriceValue,
        vipPrice: basePriceValue + vipExtraFee,
        couplePrice: basePriceValue + coupleExtraFee,
        timeRange: initialValues.startTime && initialValues.endTime
          ? [dayjs(initialValues.startTime), dayjs(initialValues.endTime)]
          : null,
        status: initialValues.status,
      });

      initialValuesSetRef.current = true;
    }
  }, [initialValues, form, cinemas]);

  // Reset flag when initialValues change
  useEffect(() => {
    initialValuesSetRef.current = false;
  }, [initialValues]);

  const handleFinish = async (values) => {
    console.log("Form values before processing:", values);
    
    try {
      // Extract start and end time from RangePicker
      const [startTime, endTime] = values.timeRange || [];
      
      // Calculate extraFee for each seat type
      const basePrice = values.basePrice || 0;
      const vipPrice = values.vipPrice || basePrice;
      const couplePrice = values.couplePrice || basePrice;
      
      const seatTypes = [
        { type: "standard", extraFee: 0 },
        { type: "vip", extraFee: Math.max(0, vipPrice - basePrice) },
        { type: "couple", extraFee: Math.max(0, couplePrice - basePrice) }
      ];

      // Build final data structure
      const finalData = {
        filmId: values.filmId,
        cinemaId: values.cinemaId,
        roomId: values.roomId,
        startTime: startTime ? startTime.toISOString() : null,
        endTime: endTime ? endTime.toISOString() : null,
        format: values.format,
        basePrice: basePrice,
        seatTypes: seatTypes,
        status: typeof values.status === 'boolean' 
          ? (values.status ? "active" : "inactive")
          : values.status
      };

      console.log("Final data to submit:", finalData);
      const result =  await onFinish(finalData);
      
      if (result === true && initialValues) {
        form.resetFields();
        setSelectedCityId(null);
        setSelectedCinemaId(null);
        setSelectedRoomId(null);
        setSupportedFormats([]);
        initialValuesSetRef.current = false;
      }
      
      return result;
    } catch (error) {
      console.error("Form submission error:", error);
      return false;
    }
  };

  const getInitialFormValues = () => {
    const defaultValues = {
      status: "inactive",
      basePrice: 50000,
      vipPrice: 80000,
      couplePrice: 120000,
    };

    if (initialValues) {
      return {
        ...defaultValues,
        ...initialValues,
      };
    }

    return defaultValues;
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={getInitialFormValues()}
      layout="vertical"
    >
      <Row gutter={[20, 5]}>
        <Col span={12}>
          <Form.Item
            name="filmId"
            label="Phim chiếu"
            rules={[{ required: true, message: "Vui lòng chọn phim" }]}
          >
            <Select
              showSearch
              placeholder="Chọn phim"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={films
                .filter(film => film.status === 'active')
                .map(film => ({
                  label: film.title,
                  value: film._id,
                }))}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Thành phố (để lọc rạp)"
            tooltip="Chọn thành phố để lọc danh sách rạp chiếu"
          >
            <Select
              allowClear
              placeholder="Chọn thành phố"
              showSearch
              optionFilterProp="label"
              onChange={handleCityChange}
              value={selectedCityId}
              options={cities.map(city => ({
                label: city.name,
                value: city._id,
              }))}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="cinemaId"
            label="Rạp chiếu"
            rules={[{ required: true, message: "Vui lòng chọn rạp chiếu" }]}
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Chọn rạp chiếu"
              allowClear
              treeDefaultExpandAll
              treeData={filteredCinemas}
              disabled={!selectedCityId}
              onChange={handleCinemaChange}
              notFoundContent={
                !selectedCityId
                  ? "Vui lòng chọn thành phố trước"
                  : "Không có rạp nào trong thành phố này"
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="roomId"
            label="Phòng chiếu"
            rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
          >
            <Select
              showSearch
              placeholder="Chọn phòng chiếu"
              optionFilterProp="children"
              disabled={!selectedCinemaId}
              onChange={handleRoomChange}
              notFoundContent={
                !selectedCinemaId
                  ? "Vui lòng chọn rạp chiếu trước"
                  : "Không có phòng chiếu nào"
              }
              options={filteredRooms
                .filter(room => room.status === 'active')
                .map(room => ({
                  label: `${room.name} (${room.seatLayout?.length || 0} ghế)`,
                  value: room._id,
                }))}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="format"
            label="Hình thức chiếu"
            rules={[{ required: true, message: "Vui lòng chọn hình thức chiếu" }]}
          >
            <Select
              placeholder="Chọn hình thức chiếu"
              disabled={!selectedRoomId || supportedFormats.length === 0}
              notFoundContent={
                !selectedRoomId
                  ? "Vui lòng chọn phòng chiếu trước"
                  : "Phòng này không hỗ trợ định dạng nào"
              }
              options={supportedFormats.map(format => ({
                label: format,
                value: format,
              }))}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="timeRange"
            label="Thời gian chiếu"
            rules={[{ required: true, message: "Vui lòng chọn thời gian chiếu" }]}
          >
            <RangePicker
              showTime={{
                format: 'HH:mm',
              }}
              format="DD/MM/YYYY HH:mm"
              placeholder={['Giờ bắt đầu', 'Giờ kết thúc']}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="basePrice"
            label="Giá ghế cơ bản (Standard)"
            rules={[
              { required: true, message: "Vui lòng nhập giá ghế cơ bản" },
              { type: 'number', min: 0, message: "Giá phải lớn hơn 0" }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="50000"
              addonAfter="VNĐ"
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="vipPrice"
            label="Giá ghế VIP"
            rules={[
              { required: true, message: "Vui lòng nhập giá ghế VIP" },
              { type: 'number', min: 0, message: "Giá phải lớn hơn 0" }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="80000"
              addonAfter="VNĐ"
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="couplePrice"
            label="Giá ghế đôi (Couple)"
            rules={[
              { required: true, message: "Vui lòng nhập giá ghế đôi" },
              { type: 'number', min: 0, message: "Giá phải lớn hơn 0" }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="120000"
              addonAfter="VNĐ"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="status"
            label="Trạng thái hoạt động"
            valuePropName="checked"
            getValueFromEvent={(checked) => (checked ? "active" : "inactive")}
            getValueProps={(value) => ({ checked: value === "active" })}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label={null}>
            <Button className="mr-10" type="primary" htmlType="submit">
              {submitButtonText}
            </Button>
            {onCancel && (
              <Button className="ml-10" onClick={onCancel}>
                Hủy
              </Button>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default ShowTimeForm;