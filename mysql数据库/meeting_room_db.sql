/*
 Navicat Premium Data Transfer

 Source Server         : mysql5.6_20210415
 Source Server Type    : MySQL
 Source Server Version : 50620
 Source Host           : localhost:3306
 Source Schema         : meeting_room_db

 Target Server Type    : MySQL
 Target Server Version : 50620
 File Encoding         : 65001

 Date: 15/04/2021 23:20:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES ('a', 'a');

-- ----------------------------
-- Table structure for t_leaveword
-- ----------------------------
DROP TABLE IF EXISTS `t_leaveword`;
CREATE TABLE `t_leaveword`  (
  `leaveWordId` int(11) NOT NULL AUTO_INCREMENT COMMENT '留言id',
  `leaveTitle` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言标题',
  `leaveContent` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言内容',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言人',
  `leaveTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '留言时间',
  `replyContent` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '管理回复',
  `replyTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回复时间',
  PRIMARY KEY (`leaveWordId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_leaveword_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_leaveword
-- ----------------------------
INSERT INTO `t_leaveword` VALUES (1, '同学交流可以预约吗', '我和几个老同学有个项目要谈，可以预约会议室吗', '13688886666', '2021-03-21 21:05:20', '可以的哈', '2021-03-21 21:05:21');
INSERT INTO `t_leaveword` VALUES (3, '我想预约，星期天可以吗', '我平时上班，只有周末有空，行吗？', '13590120934', '2021-03-21 21:48:08', '没得问题', '2021-03-22 12:19:18');
INSERT INTO `t_leaveword` VALUES (4, '11', '222', 'user1', '2021-04-13 14:10:57', '--', '--');

-- ----------------------------
-- Table structure for t_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice`  (
  `noticeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '公告id',
  `title` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `content` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告内容',
  `publishDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`noticeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_notice
-- ----------------------------
INSERT INTO `t_notice` VALUES (1, '会议室预约小程序上线了', '朋友们有需要的来这里预约吧', '2021-03-21 21:25:27');
INSERT INTO `t_notice` VALUES (2, '会议室预约流程', '手机关注小程序后选择你喜欢的会议室预约，预约提交后等待管理员接受订单，接受订单后你用你的账号付款，然后我们审核通过', '2021-03-21 21:57:35');

-- ----------------------------
-- Table structure for t_orderinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_orderinfo`;
CREATE TABLE `t_orderinfo`  (
  `orderNo` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单编号',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '下单用户',
  `placeObj` int(11) NOT NULL COMMENT '预约会议室',
  `orderDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '预定日期',
  `intervalObj` int(11) NOT NULL COMMENT '预约时段',
  `totalMoney` float NOT NULL COMMENT '订单总金额',
  `payWayObj` int(11) NOT NULL COMMENT '支付方式',
  `payAccount` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '支付账号',
  `orderStateObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '订单状态',
  `orderTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '下单时间',
  `receiveName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '收货人',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '收货人电话',
  `address` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '收货人地址',
  `orderMemo` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '订单备注',
  PRIMARY KEY (`orderNo`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  INDEX `placeObj`(`placeObj`) USING BTREE,
  INDEX `intervalObj`(`intervalObj`) USING BTREE,
  INDEX `payWayObj`(`payWayObj`) USING BTREE,
  CONSTRAINT `t_orderinfo_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_2` FOREIGN KEY (`placeObj`) REFERENCES `t_place` (`placeId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_3` FOREIGN KEY (`intervalObj`) REFERENCES `t_timeinterval` (`intervalId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_4` FOREIGN KEY (`payWayObj`) REFERENCES `t_payway` (`payWayId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_orderinfo
-- ----------------------------
INSERT INTO `t_orderinfo` VALUES (11, '13590120934', 1, '2021-03-24', 2, 40, 1, 'dashen@163.com', '待接单', '2021-03-22 12:25:09', '--', '--', '--', '我和老同学有项目要议论');
INSERT INTO `t_orderinfo` VALUES (14, 'user1', 3, '2021-04-22', 1, 50, 1, 'dashen@126.com', '已接单', '2021-04-15 22:01:04', '--', '--', '--', '测试');

-- ----------------------------
-- Table structure for t_payway
-- ----------------------------
DROP TABLE IF EXISTS `t_payway`;
CREATE TABLE `t_payway`  (
  `payWayId` int(11) NOT NULL AUTO_INCREMENT COMMENT '支付方式id',
  `payWayName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '支付方式名称',
  PRIMARY KEY (`payWayId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_payway
-- ----------------------------
INSERT INTO `t_payway` VALUES (1, '支付宝');
INSERT INTO `t_payway` VALUES (2, '微信');
INSERT INTO `t_payway` VALUES (3, '银行卡');

-- ----------------------------
-- Table structure for t_place
-- ----------------------------
DROP TABLE IF EXISTS `t_place`;
CREATE TABLE `t_place`  (
  `placeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '会议室id',
  `placeTypeObj` int(11) NOT NULL COMMENT '会议室类型',
  `placeName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '会议室名称',
  `placePhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '会议室照片',
  `personNum` int(11) NOT NULL COMMENT '容纳人数',
  `placeLocation` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '会议室位置',
  `price` float NOT NULL COMMENT '会议室单价',
  `placeDesc` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '详细介绍',
  `addTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`placeId`) USING BTREE,
  INDEX `placeTypeObj`(`placeTypeObj`) USING BTREE,
  CONSTRAINT `t_place_ibfk_1` FOREIGN KEY (`placeTypeObj`) REFERENCES `t_placetype` (`placeTypeId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_place
-- ----------------------------
INSERT INTO `t_place` VALUES (1, 1, 'HYS001', 'img/ae621981-fa07-4521-90ab-d1904bee0f64.jpg', 50, '6A-101', 20, '小包间会议室，适合小组讨论', '2021-03-21 21:04:01');
INSERT INTO `t_place` VALUES (2, 3, '会议室202', 'img/3611956f-c44e-4471-936f-1f94819ed236.jpg', 350, '6B-202', 30, '大型会议室，适合举办讲座', '2021-03-21 21:52:13');
INSERT INTO `t_place` VALUES (3, 2, '会议室206', 'img/836606ac-38fb-4a1a-882b-6884fd75e733.jpg', 120, '6B-206', 25, '可以使用多媒体设备，适合学生上课，答辩等', '2021-03-22 12:15:31');

-- ----------------------------
-- Table structure for t_placetype
-- ----------------------------
DROP TABLE IF EXISTS `t_placetype`;
CREATE TABLE `t_placetype`  (
  `placeTypeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '会议室类型id',
  `placeTypeName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '会议室类型名称',
  `placeTypeDesc` varchar(800) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '会议室类型说明',
  PRIMARY KEY (`placeTypeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_placetype
-- ----------------------------
INSERT INTO `t_placetype` VALUES (1, '小会议室', '容纳人数不多，设备一般');
INSERT INTO `t_placetype` VALUES (2, '中会议室', '可以容纳100人以上');
INSERT INTO `t_placetype` VALUES (3, '大会议室', '可以容纳300人以上');

-- ----------------------------
-- Table structure for t_timeinterval
-- ----------------------------
DROP TABLE IF EXISTS `t_timeinterval`;
CREATE TABLE `t_timeinterval`  (
  `intervalId` int(11) NOT NULL AUTO_INCREMENT COMMENT '时段id',
  `intervalName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '时段名称',
  `product` float NOT NULL COMMENT '商品数量',
  PRIMARY KEY (`intervalId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_timeinterval
-- ----------------------------
INSERT INTO `t_timeinterval` VALUES (1, '上午08:00~10:00', 2);
INSERT INTO `t_timeinterval` VALUES (2, '上午10:00~12:00', 2);
INSERT INTO `t_timeinterval` VALUES (3, '下午13:00~16:00', 3);
INSERT INTO `t_timeinterval` VALUES (4, '下午16:00~18:00', 2);
INSERT INTO `t_timeinterval` VALUES (5, '晚上19:00~22:00', 3);

-- ----------------------------
-- Table structure for t_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_userinfo`;
CREATE TABLE `t_userinfo`  (
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'user_name',
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登录密码',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `gender` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `birthDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '出生日期',
  `userPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户照片',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `address` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '家庭地址',
  `regTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`user_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_userinfo
-- ----------------------------
INSERT INTO `t_userinfo` VALUES ('13590120934', '--', '牵着蜗牛去逛街', '男', '2021-03-21', 'img//2d4c8e66-b19c-4c79-aa24-0aa2820b0616.jpg', '--', '--', '--', '2021-03-21 21:18:05');
INSERT INTO `t_userinfo` VALUES ('13688886666', '123', '李忠杰', '男', '2021-03-16', 'img/5ca1de55-d516-47ac-b7ce-b32dcfa51eac.jpg', '13508102342', 'zhongjie@126.com', '四川成都红星路5号', '2021-03-21 19:33:37');
INSERT INTO `t_userinfo` VALUES ('user1', '123', '小丽', '女', '2021-04-07', 'img/NoImage.jpg', '13510834234', 'xiaoli@126.com', '四川成都红星路！', '');

SET FOREIGN_KEY_CHECKS = 1;
