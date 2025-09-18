import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Image, 
  Button, 
  Tag, 
  Space, 
  Popconfirm, 
  message, 
  Tooltip 
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { 
  getAllFilms, 
  deleteFilm, 
  updateFilmStatus, 
  updateFilmTrending 
} from '../../services/filmServices';
import Loading from '../Loading';
import ErrorDisplay from '../ErrorDisplay';

const FilmAdminList = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch films data
  const fetchFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllFilms();
      console.log('result', result);
      setFilms(result.data || []);
    } catch (err) {
      console.error('Error fetching films:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  // Handle status toggle
  const handleStatusToggle = async (film) => {
    const filmId = film._id;
    const newStatus = film.status === 'active' ? 'inactive' : 'active';
    
    try {
      setActionLoading(prev => ({ ...prev, [`status_${filmId}`]: true }));
      
      await updateFilmStatus(filmId, newStatus);
      
      // Update local state
      setFilms(prev => 
        prev.map(item => 
          item._id === filmId 
            ? { ...item, status: newStatus }
            : item
        )
      );
      
      messageApi.success(
        `Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} phim thành công`
      );
    } catch (err) {
      console.error('Error updating status:', err);
      messageApi.error(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    } finally {
      setActionLoading(prev => ({ ...prev, [`status_${filmId}`]: false }));
    }
  };

  // Handle trending toggle
  const handleTrendingToggle = async (film) => {
    const filmId = film._id;
    const newTrending = !film.isTrending;
    
    try {
      setActionLoading(prev => ({ ...prev, [`trending_${filmId}`]: true }));
      
      await updateFilmTrending(filmId, newTrending);
      
      // Update local state
      setFilms(prev => 
        prev.map(item => 
          item._id === filmId 
            ? { ...item, isTrending: newTrending }
            : item
        )
      );
      
      messageApi.success(
        `Đã ${newTrending ? 'đánh dấu' : 'bỏ đánh dấu'} phim thịnh hành`
      );
    } catch (err) {
      console.error('Error updating trending:', err);
      messageApi.error(err.response?.data?.message || 'Không thể cập nhật trạng thái thịnh hành');
    } finally {
      setActionLoading(prev => ({ ...prev, [`trending_${filmId}`]: false }));
    }
  };

  // Handle delete film
  const handleDelete = async (filmId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`delete_${filmId}`]: true }));
      
      await deleteFilm(filmId);
      
      // Remove from local state
      setFilms(prev => prev.filter(item => item._id !== filmId));
      
      messageApi.success('Xóa phim thành công');
    } catch (err) {
      console.error('Error deleting film:', err);
      messageApi.error(err.response?.data?.message || 'Không thể xóa phim');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${filmId}`]: false }));
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Ảnh bìa',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 120,
      align: 'center',
      render: (thumbnail, record) => (
        <Image
          src={thumbnail}
          alt={record.title}
          width={80}
          height={120}
          style={{ objectFit: 'cover', borderRadius: '8px' }}
          preview={{
            mask: <div style={{ fontSize: '12px' }}>Xem ảnh</div>
          }}
        />
      ),
    },
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <div style={{ fontWeight: 'bold', maxWidth: '200px' }}>
          {title}
        </div>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      align: 'center',
      render: (duration) => `${duration} phút`,
    },
    {
      title: 'Ngày khởi chiếu',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      align: 'center',
      width: 160,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hình thức chiếu',
      dataIndex: 'availableFormats',
      key: 'availableFormats',
      width: 150,
      render: (formats) => (
        <div>
          {formats?.map(format => (
            <Tag key={format} color="blue" style={{ margin: '2px' }}>
              {format}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Giới hạn tuổi',
      dataIndex: 'ageRating',
      key: 'ageRating',
      width: 100,
      align: 'center',
      render: (ageRating) => (
        <Tag color="orange">{ageRating}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status, record) => (
        <Tag
          color={status === 'active' ? 'green' : 'red'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleStatusToggle(record)}
        >
          {actionLoading[`status_${record._id}`] 
            ? 'Đang cập nhật...' 
            : status === 'active' ? 'Hoạt động' : 'Ngưng hoạt động'
          }
        </Tag>
      ),
    },
    {
      title: 'Thịnh hành',
      dataIndex: 'isTrending',
      key: 'isTrending',
      width: 120,
      align: 'center',
      render: (isTrending, record) => (
        <Tag
          color={isTrending ? 'gold' : 'default'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleTrendingToggle(record)}
        >
          {actionLoading[`trending_${record._id}`] 
            ? 'Đang cập nhật...' 
            : isTrending ? 'Thịnh hành' : 'Bình thường'
          }
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              
              onClick={() => navigate(`/admin/films/${record._id}`)}
            />
          </Tooltip>
          
          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              icon={<EditOutlined />}
              
              onClick={() => navigate(`/admin/films/edit/${record._id}`)}
            />
          </Tooltip>
          
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc muốn xóa phim "${record.title}"?`}
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                
                loading={actionLoading[`delete_${record._id}`]}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) return <Loading tip="Đang tải danh sách phim..." />;
  
  if (error) {
    return (
      <ErrorDisplay 
        message={error}
        onRetry={fetchFilms}
      />
    );
  }

  return (
    <>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={films}
        rowKey="_id"
        pagination={{
          total: films.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} phim`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 1200 }}
        size="middle"
        
        style={{ background: '#fff', borderRadius: '8px' }}
      />
    </>
  );
};

export default FilmAdminList;