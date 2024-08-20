import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Space, theme } from "antd";
import { Outlet, Link } from "react-router-dom";
import { HiChartPie } from "react-icons/hi";
import { FaUsers, FaUserCircle } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";

const { Header, Sider, Content } = Layout;

const LayoutComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Button>Logout</Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Link to="/" className="flex items-center justify-center">
          <h1 className={`${collapsed ? "text-xl" : "text-3xl"} text-white`}>
            LOGO
          </h1>
        </Link>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<HiChartPie size={20} />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FaUsers size={20} />}>
            <Link to="/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<AiOutlineProduct size={20} />}>
            <Link to="/products">Products</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="flex justify-between"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown overlay={menu} trigger={["click"]}>
            <Space>
              <FaUserCircle size={24} />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: "calc(100vh - 112px)", // Header and margin are considered
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
