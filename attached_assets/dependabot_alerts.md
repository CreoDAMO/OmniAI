PyTorch Improper Resource Shutdown or Release vulnerability #14
 Open Opened 1 hour ago on torch (pip) · requirements.txt
Package
Affected versions
Patched version
torch
(pip)
<= 2.7.1
None
A vulnerability, which was classified as problematic, was found in PyTorch 2.6.0. Affected is the function torch.nn.functional.ctc_loss of the file aten/src/ATen/native/LossCTC.cpp. The manipulation leads to denial of service. An attack has to be approached locally. The exploit has been disclosed to the public and may be used. The name of the patch is 46fc5d8e360127361211cb237d5f9eef0223e567. It is recommended to apply a patch to fix this issue.
