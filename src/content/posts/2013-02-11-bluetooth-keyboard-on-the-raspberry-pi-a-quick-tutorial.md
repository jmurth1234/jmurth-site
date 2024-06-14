---
title: Bluetooth keyboard on the Raspberry Pi – A quick guide
author: Ryan
type: post
date: 2013-02-11T20:26:18+00:00
url: /2013/02/bluetooth-keyboard-on-the-raspberry-pi-a-quick-tutorial/
dsq_thread_id:
  - '2237867558'
---

So, over the weekend I decided to try and get my Bluetooth keyboard working on the Raspberry Pi. It was originally brought to go with my iPad, however I feel that pairing it with my Raspberry Pi would give it some actual use.

**Requirements:**

- USB Bluetooth adaptor that works with the Raspberry Pi,
- Raspbian Wheezy (should work on most other Pi distros),
- The bluetooth, bluez-utils, blueman and bluez-compat packages installed via apt-get, or your chosen package management tool.

**Disclaimer**

The following steps are the steps I used to pair and subsequently connect a bluetooth keyboard to my Pi. Your mileage may vary.

**Instructions**

1. Put the keyboard in pairing mode. Refer to your manual on how to do this.

2. Scan for your Bluetooth keyboard with `hcitool scan`. This allows you to scan for bluetooth devices. If it works, you should see an output similar to this:

   ```
   pi@raspberrypi ~ $ hcitool scan
   Scanning ...
   DC:2C:26:03:C0:30       Bluetooth keyboard
   ```

   In order to pair it, you need the 'DC:2C:26:03:C0:30' secion of that output. This differs for each device, as it is a unique device identifier known as a MAC Address.

3. Pair it with `sudo bluez-simple-agent hci0 <mac address>`. It should give you a pin to enter on the keyboard. Enter it in using the keyboard keys, then press enter on the bluetooth keyboard. If it doesn't give you a pin, then refer to your manual on what to do.

Your keyboard is paired! But it isn't connected **yet**. Here&#8217;s how to do that.

1. (Might be optional with your keyboard). Put your keyboard into pairing mode again. I had to do this because otherwise the keyboard wasn&#8217;t found.

2. Run the command `sudo hidd -i hci0 --connect <mac address>`. This connects the keyboard to the Pi.

3. (Optional) Edit `/etc/rc.local` with a text editor of your choice, and put that command in the file to automatically connect to the keyboard at startup!

If everything went according to plan, you should now be able to use your bluetooth keyboard with your Pi!

Any questions? Ask in the comments!
