# Security Policy

## Supported Versions

The following branches are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| `main` (3k release branch)  | :white_check_mark: |
| `release/2k` (2k release branch) | :white_check_mark: |

To understand more about 2k vs 3k, see the following docs; https://docs.olivetin.app/upgrade/2k3k.html

## OliveTin *is* a remote code execution (RCE) "tool"

The very purpose of OliveTin is to allow users to execute commands remotely on a machine. 

This means that, by design, OliveTin has might higher potential to be used for remote code execution (RCE), and any security vulnerabilities that do occour have the potential to be much more severe than in other types of software. 

We hope that you understand that while the project goes to great aims to be safe, and mitigate, that security vulnerabilities are inevitable, as they are with all software of all sizes - like Kubernetes, the Kernel, etc - and OliveTin has substancially less resources than those projects.

With that being said, OliveTin tries to follow examples of best practice, so judge the project not on if/when it has security issues, but how security issues are responded to as the measure of quality.

This is why we take security very seriously, and why we encourage responsible disclosure practices when reporting vulnerabilities. 

## Reporting a Vulnerability

Please use responsible disclosure practices when reporting a vulnerability. **You will receive full credit for your discovery**, and we will work with you to ensure that the issue is resolved as quickly as **possible**. Please note that only James Read has access to security issues at the moment, so please be patient and understanding if you do not receive an immediate response.

* **Option A (preferred)**: GitHub Security Advisories, which allows you to report a vulnerability privately and securely. You can find the option to report a security issue in the "Issues" tab of this repository, and then select "Report a security vulnerability". This will allow you to provide details about the vulnerability without making it public.

* **Option B**: Please email `contact@jread.com` for responsible disclosure. 

## Disclosure of how vulnerabilities were found

It is incredibly useful to not just patch security vulnerabilities, but also to understand how they were found. If you are able to share this information, it can help us and the community to better understand potential attack vectors and improve the overall security of the project.
