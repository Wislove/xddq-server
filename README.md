# xddq-server
自动任务工具

## 免责声明
	
本仓库仅供技术学习交流使用，如有下载相关文件，请在学习后24小时内删除相关内容。

切勿在 tb/pdd 等商城的非法渠道付费此软件。

如将本仓库教程/文件用于获利，那么：你妈死了。

请勿将本项目内容用于非法用途，使用者在使用时即视为对行为可能产生的任何不良后果负责。
	
由于传播、利用此工具所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。

## 使用方法

### 1. 单账号启动
```bash
yarn && yarn start
```
单账号定时重启(每天12点零1分定时重启,使用PM2)
```bash
pm2 start app.js --cron "1 0 * * *"
```
