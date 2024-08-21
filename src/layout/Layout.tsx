import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Space, theme, Select } from "antd";
import { Outlet, Link } from "react-router-dom";
import { HiChartPie } from "react-icons/hi";
import { FaUsers, FaUserCircle } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const { Header, Sider, Content } = Layout;

const LayoutComponent: React.FC = () => {
  const { t, i18n } = useTranslation(); // Tarjima funksiyasi
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">{t("profile")}</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Button>{t("logout")}</Button>
      </Menu.Item>
    </Menu>
  );

  const handleChangeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

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
            <Link to="/">{t("dashboard")}</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FaUsers size={20} />}>
            <Link to="/users">{t("users")}</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<AiOutlineProduct size={20} />}>
            <Link to="/products">{t("products")}</Link>
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
          <Space>
            <Select
              defaultValue="en"
              style={{ width: 120 }}
              onChange={handleChangeLanguage}
              options={[
                { value: "en", label: "English" },
                { value: "ru", label: "Русский" },
                { value: "uz", label: "O'zbekcha" },
              ]}
            />
            <Dropdown overlay={menu} trigger={["click"]}>
              <FaUserCircle size={24} />
            </Dropdown>
          </Space>
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
