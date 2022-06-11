set term svg size 600, 400 dynamic
set output "iv-diode.svg"
set border lw 1
set grid lw 1
set xlabel "Voltage / V"
set ylabel "Current / A"
plot for [IDX=0:*] \
  "iv-diode.data" \
  index IDX \
  using 5:6 \
  with lines lw 1 \
  title columnheader(1)
